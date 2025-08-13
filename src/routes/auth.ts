import express from 'express'
import { login, register, logout,me} from '../controllers/auth'
import { unauthorized } from '../middleware/unauthorized';
import { AuthorizePermissions } from '../middleware/role-authorize';

const router = express.Router()


router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/me',unauthorized,AuthorizePermissions('admin'),me)

export default router