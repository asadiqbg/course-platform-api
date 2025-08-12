import express, { Request, Response, NextFunction } from "express";
import { AuthorizePermissions } from "../middleware/role-authorize.js";
import { unauthorized } from "../middleware/unauthorized.js";
import { Req, Res, Next } from '../types/aliases';

const router = express.Router()

router.post('/', unauthorized, AuthorizePermissions('admin'))

export default router