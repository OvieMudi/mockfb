import { Router } from 'express';
import multer from 'multer';
import uploadImage from '../controllers/uploadsController';
import validator from '../middleware/validator';

const uploadRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });

uploadRouter.post(
  '/',
  upload.single('image'),
  validator.validateFileUpload(),
  uploadImage
);

export default uploadRouter;
