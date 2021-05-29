import { Router } from 'express';
import postRouter from './posts';
import userRouter from './users';

const router = Router();

/* GET home page. */

router.use('/users', userRouter);
router.use('/posts', postRouter);

export default router;
