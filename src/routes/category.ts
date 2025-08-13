import express, { RequestHandler } from "express";
import { unauthorized } from "../middleware/unauthorized";
import { AuthorizePermissions } from "../middleware/role-authorize";
import { createCategory } from "../controllers/categoryController";


const router = express.Router();

router.get('/create',unauthorized,AuthorizePermissions('admin'),createCategory)


export default router;