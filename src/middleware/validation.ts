import {Req,Res,Next} from '../types/aliases'
import { BadRequestError } from '../errors'
import mongoose from 'mongoose'

export const isValidated = (paramId = 'id')=>{
 return (req:Req,res:Res,next:Next)=>{
    const id = req.params[paramId]
    if(!id || id.trim()===''){
      throw new BadRequestError(`${paramId} is required`)
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestError(`Invalid ${paramId} format`)
   }
   next()
  }
}