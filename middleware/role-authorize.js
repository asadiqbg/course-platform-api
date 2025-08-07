import ForbiddenError from "../errors/forbidden.js";

export const AuthorizePermissions = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      throw new ForbiddenError('Not allowed to access this route')
    }
    next()
  }
}