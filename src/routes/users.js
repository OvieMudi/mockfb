import { Router } from 'express';
import {
  createUser,
  getUsers,
  loginUser,
  initPasswordReset,
  resetPassword,
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);

userRouter.get('/password-reset/:userId', resetPassword);
userRouter.post('/password-reset/:userId', resetPassword);
userRouter.post('/password-reset', initPasswordReset);

export default userRouter;
