import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'


export const register = async(req,res,next)=>{
  try {
    const user = User.create({...req.body})
    const token = user.createToken()

    res.status(StatusCodes.CREATED).json({token, user:{name:user.name,email:user.email}})
    
  }catch(err){
    next(err)
  }
}

export const login = (req,res) => {
  res.send('user logged in')
};