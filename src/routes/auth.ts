import express from 'express'
import { login, register, logout,me} from '../controllers/auth'
import { unauthorized } from '../middleware/unauthorized';
import { AuthorizePermissions } from '../middleware/role-authorize';
import { validationBody } from '../middleware/validation';
import {registerSchema,loginSchema} from '../Schemas/auth.schemas'

const router = express.Router()


router.post('/login',validationBody(loginSchema),login);
router.post('/register',validationBody(registerSchema), register);
router.get('/logout', unauthorized,logout);
router.get('/me',unauthorized,AuthorizePermissions('admin'),me)

export default router