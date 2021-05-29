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
    const posts = await prisma.post.findMany();
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
  deletePostById,
};
