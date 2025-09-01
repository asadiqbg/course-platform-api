import {Req,Res,Next} from '../types/aliases'
import StripeService from '../services/stripe.service';
import Order from '../models/Order';
import Course from '../models/Course';
import User from '../models/User';
import { BadRequestError } from '../errors';
import { createPaymentSchema, webhookEventSchema } from '../Schemas/payment.schema';
import mongoose from 'mongoose';

const stripeService = StripeService.getInstance()

export const createCheckoutSesssion = async(req:Req,res:Res,next:Next):Promise<void>=>{
  try{
    const validatedData = createPaymentSchema.parse(req.body)
    const {courseId,successUrl,cancelUrl} = validatedData
    //Get user from req (set by auth middleware)
    const userId = req.user?.userId 
    if(!userId){
      throw new BadRequestError('User not authenticated')
    }
    //fetch course details from database
    const course = await Course.findById(courseId)
    if(!course){
      throw new BadRequestError('Course not found')
    }
    //check if user already purchased the course
    const existingOrder = await Order.findOne({
      user:userId,
      course:courseId,
      status: 'completed'
    })
    if(existingOrder){
      throw new BadRequestError('You have already purchased this course')
    }
    //Fetch user details   
    const user = await User.findById(userId)
    if(!user){
      throw new BadRequestError('User not found')
    }

    //create stripe checkout session
    const session = await stripeService.createCheckoutSesssion({
      courseId: (course._id as mongoose.Types.ObjectId).toString(),
      courseTitle: course.title,
      coursePrice:course.price,
      userId:userId,
      userEmail:user.email,
      successUrl: successUrl || `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl:cancelUrl || `${process.env.CLIENT_URL}/payment/cancel`,
      metadata:{
        orderId: '' //will be updated after order creation
      }
    })

    const order = await Order.create({
      user:userId,
      course:courseId,
      amount:course.price,
      currency: 'usd',
      status: 'pending',
      paymentMethod: 'stripe',
      stripeSessionId:session.id, //stripe responds with session object after calling stripe checkout session api ,this id is stored in db to match when stripe sends webhook to update status
      metadata:{
        sessionUrl:session.url, //also in session object 
        expiresAt: new Date(session.expires_at * 1000),
      },
    });
  res.status(200).json({
    success:true,
    data:{
      sessionId:session.id,
      sessionUrl:session.url,
      orderId:order._id,
    }
  })
}catch(error){
  next(error)
}
}

