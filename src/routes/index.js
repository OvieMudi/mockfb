import { Router } from 'express';
import userRouter from './users';

const router = Router();

/* GET home page. */

router.use('/users', userRouter);

export default router;
