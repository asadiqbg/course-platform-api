import express, { RequestHandler } from "express";
import { unauthorized } from "../middleware/unauthorized";
import { AuthorizePermissions } from "../middleware/role-authorize";
import { validationBody,validationParams } from "../middleware/validation";
import { createCategory,updateCategory,deleteCategory } from "../controllers/categoryController";
import {createCategorySchema,updateCategorySchema,categoryParamsSchema } from '../Schemas/category.schema'



const router = express.Router();

router.post('/',unauthorized,AuthorizePermissions('admin'),validationBody(createCategorySchema),createCategory)
router.put('/:id',unauthorized,AuthorizePermissions('admin'),validationParams(categoryParamsSchema),validationBody(updateCategorySchema),updateCategory)
router.delete('/:id',unauthorized,AuthorizePermissions('admin'),validationParams(categoryParamsSchema),deleteCategory)
export default router;