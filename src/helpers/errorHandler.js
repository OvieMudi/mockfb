import log from './log';
import { serviceErrorResponse } from './serviceResponse';

/**
 * Database async error handler
 * @param {function} cb - controller callback function
 * @param {object} prisma - prisma class instance
 * @returns {object} error response object
 */
const handleDBError = (prisma, cb) =>
  cb()
    .catch((err) => {
      log(err);
      return serviceErrorResponse();
    })
    .finally(() => {
      prisma.$disconnect();
    });

/**
 * General async error handler
 * @param {function} cb - controller callback function
 * @returns {object} error response object
 */
const handleAsyncError = (cb) =>
  cb().catch((err) => {
    log(err);
    return serviceErrorResponse();
  });
/**
 * Controller async error handler
 * @param {Response} res - express response object
 * @param {function} cb - controller callback function
 * @returns {Response} express response object
 */
const handleControllerError = (res, cb) =>
  cb().catch((err) => {
    log(err);
    return res
      .status(422)
      .json({ status: false, message: 'Cannot proccess request' });
  });

export default { handleDBError, handleAsyncError, handleControllerError };
