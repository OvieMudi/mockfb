import log from './log';
import { serviceErrorResponse } from './serviceResponse';

const errorHandler = {
  handleDBError: (cb, prisma) =>
    cb()
      .catch((err) => {
        log(err);
        return serviceErrorResponse();
      })
      .finally(() => {
        prisma.$disconnect();
      }),

  handleAsyncError: (cb) => {
    cb().catch((err) => {
      log(err);
      return serviceErrorResponse();
    });
  },
};

export default errorHandler;
