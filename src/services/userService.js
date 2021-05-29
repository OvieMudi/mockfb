import dotenv from 'dotenv';
import {
  encryptPassword,
  comparePassword,
  signJwt,
  generateEmailToken,
} from '../helpers/authHelper';
import errorHandler from '../helpers/errorHandler';
import mailer from '../helpers/mailer';
import {
  serviceErrorResponse,
  serviceSuccessResponse,
} from '../helpers/serviceResponse';

dotenv.config();

const { CLIENT_URL } = process.env;

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const { handleDBError } = errorHandler;

const getAllUsers = async () =>
  handleDBError(prisma, async () => {
    const users = await prisma.user.findMany();
    return serviceSuccessResponse(users);
  });

const createUser = async (body) =>
  handleDBError(prisma, async () => {
    const existingUser = await prisma.user.findFirst({
      where: { email: body.email },
    });
    if (existingUser) {
      return serviceErrorResponse(409, 'user already exists');
    }
    const hashedPassword = await encryptPassword(body.password);
    const user = await prisma.user.create({
      data: { ...body, password: hashedPassword },
    });
    user.password = undefined;
    user.token = signJwt({ id: user.id });
    mailer.sendWelcomeEmail(user.email, user.name);
    return serviceSuccessResponse(user, 201);
  });

const loginUser = async (body) =>
  handleDBError(prisma, async () => {
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
  });

const initPasswordReset = async (email) =>
  handleDBError(prisma, async () => {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (!existingUser) {
      return serviceErrorResponse(400, 'Not found');
    }

    const existingToken = await prisma.token.findFirst({
      where: { userId: existingUser.id, type: 'email' },
    });
    if (existingToken) {
      await prisma.token.delete({ where: { id: existingToken.id } });
    }
    const { token, hash } = await generateEmailToken();
    await prisma.token.create({
      data: {
        userId: existingUser.id,
        token: hash,
      },
    });
    // send mail
    const resetLink = `${CLIENT_URL}/password-reset/${existingUser.id}?tk=${token}`;
    mailer.sendPasswsordResetEmail(
      existingUser.email,
      existingUser.name,
      resetLink
    );
    return serviceSuccessResponse();
  });

const resetPassword = async (userId, token, password) =>
  handleDBError(prisma, async () => {
    const errorMessage =
      'Your password reset link is either invalid or has expired.';

    const existingToken = await prisma.token.findFirst({
      where: { userId, type: 'email' },
    });
    if (!existingToken) {
      return serviceErrorResponse(401, errorMessage);
    }

    const isExpired =
      Number(existingToken.createdAt) + Number(existingToken.ExpiresAt) >
      Date.now();
    if (isExpired) {
      return serviceErrorResponse(401, errorMessage);
    }

    const isValid = await comparePassword(token, existingToken.token);
    if (!isValid) {
      return serviceErrorResponse(401, errorMessage);
    }

    await prisma.user.update({
      data: { password: await encryptPassword(password) },
      where: { id: userId },
    });

    await prisma.token.delete({ where: { id: existingToken.id } });

    return serviceSuccessResponse({}, 200, 'Password reset successful');
  });

export default {
  getAllUsers,
  createUser,
  loginUser,
  initPasswordReset,
  resetPassword,
};
