import { Router } from 'express';
import {
  publishPost,
  getAllPosts,
  getPost,
  editPost,
  deletePost,
  likePost,
} from '../controllers/postController';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

const postRouter = Router();

const { authorizeOwner, authorizeOwnerOnly } = authorize;

postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPost);

postRouter.post('/', authenticate, publishPost);
postRouter.patch('/:id', authenticate, authorizeOwnerOnly('post'), editPost);

postRouter.post('/:id/likes', authenticate, likePost);

postRouter.delete('/:id', authenticate, authorizeOwner('post'), deletePost);

export default postRouter;
