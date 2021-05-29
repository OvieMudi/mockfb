import { Router } from 'express';
import {
  createUser,
  getUsers,
  loginUser,
  initPasswordReset,
  resetPassword,
} from '../controllers/userController';
import validator from '../middleware/validator';

const { validateLogin, validateRegister } = validator;

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/register', validateRegister(), createUser);
userRouter.post('/login', validateLogin(), loginUser);

userRouter.get('/password-reset/:userId', resetPassword);
userRouter.post('/password-reset/:userId', resetPassword);
userRouter.post('/password-reset', initPasswordReset);

export default userRouter;
