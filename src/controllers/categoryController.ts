import { BadRequestError, NotFoundError } from "../errors/index";
import Category from "../models/Category";
import { StatusCodes } from "http-status-codes";
import {Req,Res,Next} from '../types/aliases'

export const createCategory = async(req: Req,res: Res,next: Next) => {
  const {name}:{name:string} = req.body
  if(!name) throw new BadRequestError('Please enter a valide name')
  try{
  const category = await Category.create({name})
  res.status(StatusCodes.OK).json({msg:'Category created',category})
  }catch(err){
    next(err)
  }
}

export const updateCategory = async(req: Req,res: Res,next: Next)=>{
  const {id} = req.params
  const {name}:{name:string} = req.body
    if (!name) {
      throw new BadRequestError('Please provide a new name for the category');
    }
    try{
    const updatedCategory = await Category.findByIdAndUpdate(id, { name },
      { new: true, runValidators: true }
    );
    if(!updatedCategory){
      throw new NotFoundError(`No category with id: ${id}`);
    }
    res.status(StatusCodes.OK).json({msg: 'Category updated', category: updatedCategory});
  }catch(err){
    next(err);
  }
}