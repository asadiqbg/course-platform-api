import express, { RequestHandler } from "express";
import { unauthorized } from "../middleware/unauthorized";
import { AuthorizePermissions } from "../middleware/role-authorize";
import { isValidated } from "../middleware/validation";
import { createCategory,updateCategory,deleteCategory } from "../controllers/categoryController";
import {Req,Res} from '../types/aliases'


const router = express.Router();

router.post('/',unauthorized,AuthorizePermissions('admin'),createCategory)
router.put('/:id',unauthorized,AuthorizePermissions('admin'),isValidated(),updateCategory)
router.delete('/:id',unauthorized,AuthorizePermissions('admin'),isValidated(),deleteCategory)
export default router;