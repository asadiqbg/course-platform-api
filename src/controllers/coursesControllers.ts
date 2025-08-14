import Course from "../models/Course";
import { BadRequestError, NotFoundError } from "../errors";
import {Req,Res,Next} from '../types/aliases'
import { StatusCodes } from "http-status-codes";


export const createCourse = async(req:Req,res:Res,next:Next)=>{
  const {name}:{name:string} = req.body
  if(!name || name.trim() === ''){
    throw new BadRequestError('Please provide name')
  }
  try{
    const existingCourse = await Course.findOne({name:name.trim()})
    if(existingCourse){
      throw new BadRequestError('Course already exists')
    }
    const course = await Course.create(name)
    res.status(StatusCodes.OK).json({success:true,msg:'Course created',data:course})
  }catch(err){
    next(err as Error)
  }
}

export const updateCourse = async(req:Req,res:Res,next:Next)=>{
  const {name}:{name:string} = req.body
  const {id} = req.params as {id:string}
  // id is validated in validation middleware
  if(!name || name.trim()=== ''){
    throw new BadRequestError('Please provide valid course name')
  }
  try{
    const updatedCourse = await Course.findByIdAndUpdate(id,{name},{
      new:true,
      runValidators:true
    })
    if(!updatedCourse){
      throw new NotFoundError('Course not found')
    }
    res.status(StatusCodes.OK).json({success:true,msg:'Course updated',updatedCourse})
  }catch(err){
    next(err as Error)
  }
}

export const deleteCourse = async(req:Req,res:Res,next:Next)=>{
  const {id}= req.params as {id:string}
  // id is validated in validation middleware
  try{
    const course = await Course.findByIdAndDelete(id)
    if(!course){
      throw new NotFoundError(`No course found with id : ${id}`)
    }
    res.status(StatusCodes.OK).json({success:true,msg:'Course deleted successfully',data:course})
  }catch(err){
    next(err as Error)
  }
  
}