import bcrypt from 'bcrypt';
import util from 'util';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const { AUTH_SECRET } = process.env;

const hash = util.promisify(bcrypt.hash);
const compare = util.promisify(bcrypt.compare);

export const encryptPassword = async (password) => {
  const encrypted = await hash(password, 10);
  return encrypted;
};

export const comparePassword = async (password, encryptedPassword) => {
  const isValid = await compare(password, encryptedPassword);
  return isValid;
};

export const signJwt = (data) => {
  const token = jwt.sign(data, AUTH_SECRET, { expiresIn: '3h' });
  return token;
};
