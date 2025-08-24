import Stripe from 'stripe'


class StripeService {
  private  stripe: Stripe
  private static instance:StripeService;
  
  private constructor(){
    if(!process.env.STRIPE_SECRET_KEY){
      throw new Error('Stripe key is not defined in the environment')
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{
      apiVersion:'2025-07-30.basil',
      typescript:true,
    })
  }

  public static getInstance():StripeService{
    if(!StripeService.instance){
      StripeService.instance = new StripeService()
    }
    return StripeService.instance
  }
  public getStripeInstance():Stripe{
    return this.stripe;
  }
}