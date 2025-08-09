import { BadRequestError, NotFoundError } from "../errors/index.js";
import Category from "../models/Category.js";
import { StatusCodes } from "http-status-codes";

export const createCategory = async(req,res,next) => {
  const {name} = req.body
  if(!name) throw new BadRequestError('Please enter a valide name')
  try{
  const category = await Category.create({name})
  res.status(StatusCodes.OK).json({msg:'Category created',category})
  }catch(err){
    next(err)
  }
}

export const updateCategory = async(req,res,next)=>{
  const {id} = req.params
  const {name} = req.body
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