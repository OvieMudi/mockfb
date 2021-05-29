import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { config } from 'dotenv';

config();

const { AUTH_SECRET } = process.env;

export const encryptPassword = async (password) => {
  const encrypted = await bcrypt.hash(password, 10);
  return encrypted;
};

export const comparePassword = async (password, encryptedPassword) => {
  const isValid = await bcrypt.compare(password, encryptedPassword);
  return isValid;
};

export const signJwt = (data) => {
  const token = jwt.sign(data, AUTH_SECRET, { expiresIn: '3h' });
  return token;
};

export const generateEmailToken = async () => {
  const randomBytes = promisify(crypto.randomBytes);
  const token = (await randomBytes(32)).toString('hex');
  const hash = await bcrypt.hash(token, 10);
  return { token, hash };
};
