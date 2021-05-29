import { Router } from 'express';
import { createUser, getUsers, loginUser } from '../controllers/userController';

const userRouter = Router();

/* GET users listing. */
userRouter.get('/', getUsers);
userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);

export default userRouter;
