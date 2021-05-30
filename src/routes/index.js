import { Router } from 'express';
import postRouter from './posts';
import uploadRouter from './uploads';
import userRouter from './users';

const router = Router();

/* GET home page. */

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/uploads', uploadRouter);

export default router;
