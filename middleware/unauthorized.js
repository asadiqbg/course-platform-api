import { UnauthenticatedError } from "../errors/index.js";
import jwt from 'jsonwebtoken'

export const unauthorized = async(req,res,next)=>{
  const token= req.cookies.token
  if(!token){
    throw new UnauthenticatedError('Unauthorized: No token provided')
  }
  try{
    const payload = jwt.verify(token,process.env.JWT_SECRET)
    req.user = {userId:payload.userId, name:payload.name}
    next()
  }catch(err){
    next(err)
  }
}