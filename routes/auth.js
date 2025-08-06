import express from 'express'
import { login, register, logout, me } from '../controllers/auth.js'
import { unauthorized } from '../middleware/unauthorized.js';

const router = express.Router()


router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/me', unauthorized, me);

export default router