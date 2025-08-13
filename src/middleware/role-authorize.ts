import {Req,Res,Next} from '../types/aliases'
import ForbiddenError from "../errors/forbidden";

export const AuthorizePermissions = (...roles:string[])=>{
  return (req: Req,res: Res,next: Next)=>{
    // `req.user?.role` uses optional chaining to safely access role without throwing
    // an error if `req.user` is undefined.
    // `?? ''` ensures that if role is undefined or null, we fall back to an empty string,
    // so `.includes()` always receives a string and avoids type errors.
    if(!roles.includes(req.user?.role??'')){
      console.log('access denied')
      throw new ForbiddenError('Not allowed to access this route')
    }
    console.log('access granted')
    next()
    }
  }
