import express from 'express';
import { signup, login } from '../controllers/userController.js';
import validateUsernameOrEmail from '../middleware/validateUsernameOrEmail.js';

const router = express.Router();

router.post('/signup', validateUsernameOrEmail, signup);

router.post('/login', validateUsernameOrEmail, login);

export default router;