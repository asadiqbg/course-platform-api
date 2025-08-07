import express from "express";
import { AuthorizePermissions } from "../middleware/role-authorize.js";
import { unauthorized } from "../middleware/unauthorized.js";

const router = express.Router()


router.post('/',unauthorized,AuthorizePermissions('admin'))

export default router