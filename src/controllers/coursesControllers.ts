import Course from "../models/Course";
import { BadRequestError, NotFoundError } from "../errors";
import {Req,Res,Next} from '../types/aliases'
import { StatusCodes } from "http-status-codes";
import { CreateCourseInput,UpdateCourseInput,CourseParamsInput,CourseQueryInput} from "../Schemas/courses.schema";

export const createCourse = async(req:Req,res:Res,next:Next)=>{
  const courseData : CreateCourseInput = req.body
  const {title}:{title:string} = req.body
  //body validated by validationbody middleware thorough ZodSchema
  try{
    const existingCourse = await Course.findOne({title:title.trim()})
    if(existingCourse){
      throw new BadRequestError('Course already exists')
    }
    //use spreading operator to add instructor field within courseData
    const course = await Course.create({...courseData,
      instructor:req.user?.userId
    })
    res.status(StatusCodes.OK).json({success:true,msg:'Course created',data:course})
  }catch(err){
    next(err as Error)
  }
}

export const updateCourse = async(req:Req,res:Res,next:Next)=>{
  const {title}:{title:string} = req.body
  const courseData : UpdateCourseInput = req.body
  const {id} = req.params
  // id is validated in validationparam middleware
  if(!title || title.trim()=== ''){
    throw new BadRequestError('Please provide valid course name')
  }
  try{
    const updatedCourse = await Course.findByIdAndUpdate(id,courseData,{
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
  const {id}= req.params
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