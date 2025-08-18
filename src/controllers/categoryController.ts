import { BadRequestError, NotFoundError } from "../errors/index";
import Category from "../models/Category";
import { StatusCodes } from "http-status-codes";
import {Req,Res,Next} from '../types/aliases'
import { CreateCategoryInput,UpdateCategoryInput } from "../Schemas/category.schema";

export const createCategory = async(req: Req,res: Res,next: Next) => {
  const {name}:{name:string} = req.body
  const categoryData:CreateCategoryInput = req.body
  try{
  const existingCategory = await Category.findOne({name:name.trim()})
  if(existingCategory){
    throw new BadRequestError('Category already exists')
  }
  const category = await Category.create(categoryData)
  res.status(StatusCodes.OK).json({success:true,msg:'Category created',category})
  }catch(err){
    next(err as Error)
  }
}

export const updateCategory = async(req: Req,res: Res,next: Next)=>{
  const {name}:CreateCategoryInput = req.body
  const {id} = req.params
  // id is validated in validation middleware
  const categoryData:UpdateCategoryInput = req.body
    if (!name || name.trim()=== '') {
      throw new BadRequestError('Please provide a new name for the category');
    }
    try{
    const updatedCategory = await Category.findByIdAndUpdate(id, categoryData,
      { new: true, runValidators: true }
    );
    if(!updatedCategory){
      throw new NotFoundError(`No category with id: ${id}`);
    }
    res.status(StatusCodes.OK).json({success:true,msg: 'Category updated', category: updatedCategory});
  }catch(err){
    next(err as Error);
  }
}

export const deleteCategory = async(req:Req,res:Res,next:Next)=>{
  const {id} = req.params as {id:string}
  try{
    const category = await Category.findByIdAndDelete(id)
    if(!category){
      throw new NotFoundError(`No category with id :${id}`)
    }
    res.status(StatusCodes.OK).json({success:true,msg:'category deleted',data:category})
  }catch(err){
    next(err as Error)
  }
}