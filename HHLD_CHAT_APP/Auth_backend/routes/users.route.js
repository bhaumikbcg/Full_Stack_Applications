import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import getUsers from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', verifyToken, getUsers);

export default router;

//index.js --> /auth
// because we want to go to sign up or login, and we already have /auth in index.js
// so in auth.route.js we just need /signup or /login
//similarly in index.js we have /users, so for users.route we just need /