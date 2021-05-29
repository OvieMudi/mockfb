import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { json } from 'express';

dotenv.config();

const { AUTH_SECRET } = process.env;
const prisma = new PrismaClient();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'you have to be logged in to continue',
    });
  }

  return jwt.verify(token, AUTH_SECRET, async (error, data) => {
    const message = 'you are not authorized to make this request';
    if (error) {
      return res.status(401).json({ status: false, errors: message });
    }
    try {
      const user = await prisma.user.findUnique({ where: { id: data.id } });
      if (!user) {
        return res.status(401).json({ status: false, errors: message });
      }
      req.user = user;
      return next();
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, errors: 'Something went wrong' });
    } finally {
      prisma.$disconnect();
    }
  });
};

export default authenticate;
