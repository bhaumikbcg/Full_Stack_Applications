import express from 'express';
import signup, { login } from '../controllers/auth.controller.js';
//for default export you dont have to give curly braces, for named export you have to give curly braces

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;