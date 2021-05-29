import {
  encryptPassword,
  comparePassword,
  signJwt,
} from '../helpers/authHelper';
import errorHandler from '../helpers/errorHandler';
import mailer from '../helpers/mailer';
import {
  serviceErrorResponse,
  serviceSuccessResponse,
} from '../helpers/serviceResponse';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllUsers = async () =>
  errorHandler.handleDBError(async () => {
    const users = await prisma.user.findMany();
    return serviceSuccessResponse(users);
  }, prisma);

const createUser = async (body) =>
  errorHandler.handleDBError(async () => {
    const existingUser = await prisma.user.findFirst({
      where: { email: body.email },
    });
    if (existingUser) {
      return serviceErrorResponse(409, 'user already exists');
    }
    const user = await prisma.user.create({
      data: { ...body, password: await encryptPassword(body.password) },
    });
    user.password = undefined;
    user.token = signJwt({ id: user.id });
    mailer.sendWelcomeEmail(user.email, user.name);
    return serviceSuccessResponse(user, 201);
  }, prisma);

const loginUser = async (body) =>
  errorHandler.handleDBError(async () => {
    const existingUser = await prisma.user.findFirst({
      where: { email: body.email },
    });
    if (!existingUser) {
      return serviceErrorResponse(401, 'Incorrect email or password');
    }
    const isValidPassword = await comparePassword(
      body.password,
      existingUser.password
    );
    if (!isValidPassword) {
      return serviceErrorResponse(401, 'Incorrect email or password');
    }
    existingUser.password = undefined;
    existingUser.token = signJwt({ id: existingUser.id });
    return serviceSuccessResponse(existingUser);
  }, prisma);

export default {
  getAllUsers,
  createUser,
  loginUser,
};
