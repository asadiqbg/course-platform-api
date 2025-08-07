import { UnauthenticatedError } from "../errors/index.js";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const unauthorized = async(req,res,next)=>{
  const token= req.cookies.token;
  if(!token){
    throw new UnauthenticatedError('Unauthorized: No token provided');
  }
  try{
    const payload = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-password');
    if(!user){
      throw new UnauthenticatedError('Authentication Invalid');
    }
    req.user = {userId:payload.userId, name:payload.name, role: payload.role}
    next()
  }catch(err){
    if(err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'){
      throw new UnauthenticatedError('Authentication Invalid')
    }
    next(err)
  }
}