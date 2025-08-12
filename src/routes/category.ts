import express, { RequestHandler } from "express";
import { unauthorized } from "../middleware/unauthorized.js";
import { AuthorizePermissions } from "../middleware/role-authorize.js";
import { createCategory } from "../controllers/categoryController.js";
import { Req, Res, Next } from '../types/aliases';

const router = express.Router();

router.get('/create',unauthorized,AuthorizePermissions('admin'),createCategory)


export default router;