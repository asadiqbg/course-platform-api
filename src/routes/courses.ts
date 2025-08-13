import express, { Request, Response, NextFunction } from "express";
import { AuthorizePermissions } from "../middleware/role-authorize";
import { unauthorized } from "../middleware/unauthorized";


const router = express.Router()

router.post('/', unauthorized, AuthorizePermissions('admin'))

export default router