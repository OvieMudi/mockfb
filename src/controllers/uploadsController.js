import errorHandler from '../helpers/errorHandler';
import uploadFile from '../services/uploadService';

const { handleControllerError } = errorHandler;

const uploadImage = (req, res) =>
  handleControllerError(res, async () => {
    const { success, data, code, message } = await uploadFile(req.file);
    if (success) {
      return res.status(code).json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  });

export default uploadImage;
