import { PrismaClient } from '@prisma/client';
import errorHandler from '../helpers/errorHandler';

const prisma = new PrismaClient();

const errorMessage = 'you do not have permission to access this resource';
const auth = (roleArray) => (req, res, next) => {
  if (roleArray.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({
    status: false,
    errors: errorMessage,
  });
};

const authorizeOwner = (modelName) => (req, res, next) =>
  errorHandler.handleDBError(prisma, async () => {
    const { id } = req.params;
    const resource = await prisma[modelName].findUnique({ where: { id } });
    if (resource?.userId === req.user.id || req.user.role === 'admin')
      return next();
    return res.status(403).json({
      status: false,
      errors: errorMessage,
    });
  });

const authorizeOwnerOnly = (modelName) => (req, res, next) =>
  errorHandler.handleDBError(prisma, async () => {
    const { id } = req.params;
    const resource = await prisma[modelName].findUnique({ where: { id } });
    if (resource?.userId === req.user.id) return next();
    return res.status(403).json({
      status: false,
      errors: errorMessage,
    });
  });

const authorizeAdminOnly = auth(['admin']);

export default { authorizeOwner, authorizeOwnerOnly, authorizeAdminOnly };
