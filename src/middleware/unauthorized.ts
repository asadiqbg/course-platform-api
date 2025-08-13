/// <reference path="../types/global.d.ts" />
import { UnauthenticatedError } from "../errors/index";
import jwt, {JwtPayload} from 'jsonwebtoken';
import User from '../models/User';
import {Req,Res,Next} from '../types/aliases'

export const unauthorized = async(req: Req,res: Res,next: Next)=>{
  const token= req.cookies.token;
  if(!token){
    throw new UnauthenticatedError('Unauthorized: No token provided');
  }
  try{
    const payload = jwt.verify(token,process.env.JWT_SECRET as string)as JwtPayload;
    const user = await User.findById(payload.userId).select('-password');
    if(!user){
      throw new UnauthenticatedError('Authentication Invalid');
    }
    req.user = {userId:payload.userId, name:payload.name, role: payload.role}
    next()
  }catch(err){
    if(err instanceof Error){
    if(err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'){
      throw new UnauthenticatedError('Authentication Invalid')
    }
  }
    next(err)
  }
}