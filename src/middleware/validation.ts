import {Req,Res,Next} from '../types/aliases'
import { BadRequestError } from '../errors'
import {z} from 'zod'

export const validationBody = (schema: z.ZodSchema)=>{
  return (req:Req, res:Res, next:Next)=>{
      try{
        req.body = schema.parse(req.body)
        next()
      }catch(error){
        if(error instanceof z.ZodError){
          const errors = error.issues.map(err=>({
            field: err.path.join('.'),
            message: err.message
          }))
          throw new BadRequestError('Validation Failed',errors)
        }
        next(error)
      }
    }
}


export const validationQuery = (schema: z.ZodSchema)=>{
  return (req:Req, res:Res, next:Next)=>{
      try{
        req.query = schema.parse(req.query) as typeof req.query
        next()
      }catch(error){
        if(error instanceof z.ZodError){
          const errors = error.issues.map(err=>({
            field: err.path.join('.'),
            message: err.message
          }))
          throw new BadRequestError('Validation Failed',errors)
        }
        next(error)
      }
    }
}


export const validationParams = (schema: z.ZodSchema)=>{
  return (req:Req, res:Res, next:Next)=>{
      try{
        req.params = schema.parse(req.params) as typeof req.params
        next()
      }catch(error){
        if(error instanceof z.ZodError){
          const errors = error.issues.map(err=>({
            field: err.path.join('.'),
            message: err.message
          }))
          throw new BadRequestError('Validation Failed',errors)
        }
        next(error)
      }
    }
}