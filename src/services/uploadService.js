import Imagekit from 'imagekit';
import dotenv from 'dotenv';
import errorHandler from '../helpers/errorHandler';
import {
  serviceSuccessResponse,
  serviceErrorResponse,
} from '../helpers/serviceResponse';
import log from '../helpers/log';

dotenv.config();
const { handleAsyncError } = errorHandler;

const { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;
const imagekit = new Imagekit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

const uploadFile = async (file) =>
  handleAsyncError(async () => {
    const image = file.buffer.toString('base64');
    const post = await imagekit.upload({
      file: image,
      fileName: file.originalname,
      useUniqueFileName: true,
    });
    return serviceSuccessResponse(post);
  });

export default uploadFile;
