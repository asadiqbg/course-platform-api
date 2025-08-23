import { uploadSingle, uploadMultiple } from './fileUpload';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../utils/cloudinaryUpload';
import BadRequestError from '../errors/Bad-request';
import {Req,Res,Next} from '../types/aliases'
import {z} from 'zod'

export const uploadSingleFileToCloudinary = (
  fieldName:string,
  folder:string = 'uploads'
)=> {
  //our factoryFunction uploadsinglefiletocloud.. returns this middleware
  //where multer is called and then calling next automatically, we intercept the req by calling
  //our own callback funciton
  //the callback funciton checks for err or if (!req.file) then just pass to next middleware,
  //no need to cloudinary else we await cloudinary upload
  return async(req:Req,res:Res,next:Next)=>{
    //intercept with our callback after multer and make it async to await cloudinary upload
    //note: multer doesnt return a promise it just expects a callback with next()
    uploadSingle(fieldName)(req,res,async(err)=>{
      if(err){
        return next(new BadRequestError('File upload error'))
      }
      if(!req.file){
        return next()
      }
      try{
        console.log('file ready')
      const cloudinaryResult = await uploadToCloudinary(req.file.path);
      req.cloudinaryFile = cloudinaryResult
      console.log('file uploaded')
      next()
      }catch(error){
        next (new BadRequestError(`Cloudinary upload error ${error}`))
      }
    })
  }
}

export const uploadMultipleFilesToCloudinary = (
  fieldname: string,
  maxCount:number = 5,
  folder:string =  'uploads'
)=>{
  return async(req:Req,res:Res,next:Next)=>{
    uploadMultiple(fieldname,maxCount)(req,res,async(err)=>{
      if(err){
        return next (new BadRequestError('File upload error')
        )
      }
      //Req.Files(with *s) depending upon how many files you upload whether(multiples in this case)
      if(!req.files || (req.files as Express.Multer.File[]).length===0){
        return next()
      }
      try{
        const files = req.files as Express.Multer.File[];
        const filePaths = files.map(file=>file.path)

        const cloudinaryResults = await uploadMultipleToCloudinary(filePaths,folder)
        req.cloudinaryFiles = cloudinaryResults
      }catch(error){
        next(new BadRequestError(
        `Cloudinary upload error ${error}`
        ))
      }
    }
  )}
}
