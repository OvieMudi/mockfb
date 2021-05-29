import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import errorHandler from '../helpers/errorHandler';
import {
  serviceErrorResponse,
  serviceSuccessResponse,
} from '../helpers/serviceResponse';

dotenv.config();

const prisma = new PrismaClient();

const { handleDBError } = errorHandler;

const getPostById = async (id) =>
  handleDBError(prisma, async () => {
    const post = await prisma.post.findUnique({ where: { id } });
    if (post) return serviceSuccessResponse(post);
    return serviceErrorResponse(404, 'Post does not exist');
  });

const getAllPosts = async () =>
  handleDBError(prisma, async () => {
    const posts = await prisma.post.findMany({
      include: { likes: true },
    });
    return serviceSuccessResponse(posts);
  });

const getAllPostsByUser = async (userId) =>
  handleDBError(prisma, async () => {
    const posts = await prisma.post.findMany({ where: { userId } });
    return serviceSuccessResponse(posts);
  });

const createPost = async (data) =>
  handleDBError(prisma, async () => {
    const post = await prisma.post.create({
      data,
    });
    return serviceSuccessResponse(post, 201);
  });

const editPost = async (data) =>
  handleDBError(prisma, async () => {
    const existingPost = await prisma.post.findUnique({
      where: { id: data.id },
    });
    if (!existingPost) return serviceErrorResponse(404, 'post does not exist');
    const post = await prisma.post.update({
      data,
      where: { id: data.id },
    });
    return serviceSuccessResponse(post);
  });

const likePost = async (postId, userId) =>
  handleDBError(prisma, async () => {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!existingPost) return serviceErrorResponse(404, 'post does not exist');

    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });
    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return serviceSuccessResponse(existingLike, 200, 'Post unliked');
    }

    const like = await prisma.like.create({
      data: { postId, userId },
    });
    return serviceSuccessResponse(like, 200, 'Post liked');
  });

const deletePostById = async (id) =>
  handleDBError(prisma, async () => {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return serviceErrorResponse(404, 'post does not exist');
    const post = await prisma.post.delete({ where: { id } });
    return serviceSuccessResponse(
      post,
      200,
      'The post was successfully deleted'
    );
  });

export default {
  getPostById,
  getAllPosts,
  getAllPostsByUser,
  createPost,
  editPost,
  likePost,
  deletePostById,
};
