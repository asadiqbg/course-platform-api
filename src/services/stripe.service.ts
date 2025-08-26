import Stripe from 'stripe'
import { CheckoutSessionParams } from '../types/stripe';
import { StatusCodes } from 'http-status-codes';
//Using singletion to create only one instance of class
//across whole app
class StripeService {
  private static instance: StripeService;
  private stripe:Stripe;

  private constructor(){
    if(!process.env.STRIPE_SECRET_KEY){
      throw new Error('Stripe key is not defined')
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{
      apiVersion: '2025-07-30.basil',
      typescript: true,
    })
  }

  public static getInstance():StripeService{
    if(!StripeService.instance){
      StripeService.instance = new StripeService()
    }
    return StripeService.instance
  }

  public getStripeInstance():Stripe{
    return this.stripe
  }

  public async createCheckoutSesssion(params:CheckoutSessionParams):Promise<Stripe.Checkout.Session>{
   try{
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:'payment',
      customer_email: params.userEmail,
      line_items:[
        {
          price_data:{
            currency:'usd',
            product_data:{
              name:params.courseTitle,
              description: `Purchase of ${params.courseTitle}`,
              metadata:{
                courseId:params.courseId,
              },
            },
            unit_amount:Math.round(params.coursePrice*100),
          },
          quantity:1,
        },
      ],
      metadata:{
        userId:params.userId,
        userEmail:params.userEmail,
        courseId:params.courseId,
        type: 'course-purchase',
        ...params.metadata
      },
      success_url:params.successUrl,
      cancel_url:params.cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });
    return session
   }catch(error){
    throw new Error(
        'Failed to create checkout session'
    )
   }
  }

  async retrieveSession(sessionId:string):Promise<Stripe.Checkout.Session>{
    try{
      const session = await this.stripe.checkout.sessions.retrieve(sessionId,{
        expand:['payment_intent','subscription']
      })
      return session
    }catch(error){
      throw new Error(
        'Failed to retrieve checkout session'
      )
    }
  }

/**
 * Payment Intents are the source of truth for the payment’s state.
  Even if a Checkout Session exists, you often need to check the PaymentIntent to confirm if the payment was truly successful before unlocking access (like enrolling a user in a course in your app).
 */

  async retrievepaymentIntent(paymentIntentId:string):Promise<Stripe.PaymentIntent>{
    try{
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)
      return paymentIntent
    }catch(error){
      throw new Error('Failed to retrieve payment intent')
    }
  }

  /**
   * Stripe Checkout can auto-create customers if you don’t specify one.
      But in production, you often want control:
      Link your internal User model to Stripe’s Customer.
      Store customer.id in your database.
      Reuse that customer across multiple checkouts, subscriptions, invoices.
   */
    async createCustomer(params: {
    email: string;
    name: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: params.email,
        name: params.name,
        metadata: params.metadata,
      });
      return customer;
    } catch (error) {
      throw new Error('Failed to create customer');
    }
  }
  /**
   * Create a refund
   */
  async createRefund(params: {
    paymentIntentId: string;
    amount?: number;
    reason?: Stripe.RefundCreateParams.Reason;
  }): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: params.paymentIntentId,
        amount: params.amount,
        reason: params.reason || 'requested_by_customer',
      });
      return refund;
    } catch (error) {
      throw new Error('Failed to create refund');
    }
  }
/**
 * You register a webhook endpoint with Stripe.
Stripe creates an event when something happens (checkout success, payment fail, etc.).
Stripe sends an HTTP POST request to your webhook endpoint.
Payload (event data)
Signature header (authenticity proof)
Your server:
Extracts payload + signature
Uses constructEvent() with your secret to verify
If valid → you trust the event → route it to handler (DB update, email, etc.)
If invalid → reject with 400.
Stripe expects a 200 OK from you → meaning “I got it.”
If not, Stripe retries sending the webhook multiple times.
 */
constructWebhookEvent(payload:string | Buffer,signature:string,webhookSecret:string):Stripe.Event{
  try{
    return this.stripe.webhooks.constructEvent(payload,signature,webhookSecret)
  }catch(error){
    throw new Error('Invalid webhook signature')
  }
}

 // List all products
   
  async listProducts(params?: {
    limit?: number;
    starting_after?: string;
  }): Promise<Stripe.ApiList<Stripe.Product>> {
    try {
      return await this.stripe.products.list({
        limit: params?.limit || 10,
        starting_after: params?.starting_after,
      });
    } catch (error) {
      throw new Error('Failed to list products');
    }
  }

  /**
   * Create a product
   */
  async createProduct(params: {
    name: string;
    description?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Product> {
    try {
      return await this.stripe.products.create({
        name: params.name,
        description: params.description,
        metadata: params.metadata,
      });
    } catch (error) {
      throw new Error('Failed to create product');
    }
  }

  /**
   * Create a price for a product
   */
  async createPrice(params: {
    productId: string;
    unitAmount: number;
    currency?: string;
    recurring?: {
      interval: 'day' | 'week' | 'month' | 'year';
      intervalCount?: number;
    };
  }): Promise<Stripe.Price> {
    try {
      const priceParams: Stripe.PriceCreateParams = {
        product: params.productId,
        unit_amount: params.unitAmount,
        currency: params.currency || 'usd',
      };

      if (params.recurring) {
        priceParams.recurring = {
          interval: params.recurring.interval,
          interval_count: params.recurring.intervalCount || 1,
        };
      }

      return await this.stripe.prices.create(priceParams);
    } catch (error) {
      throw new Error('Failed to create price');
    }
  }
}

export default StripeService;

