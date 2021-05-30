import { body, param, validationResult } from 'express-validator';

const email = body('email')
  .trim()
  .normalizeEmail({ gmail_remove_dots: false })
  .isEmail()
  .withMessage('please enter a valid email');

const password = body('password')
  .trim()
  .isLength({ min: 6 })
  .withMessage('Password must be at least six characters');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(401).json({
    status: false,
    message: extractedErrors,
  });
};

const validateLogin = () => [email, password, validate];

const validateRegister = () => [
  body('name').trim().isLength({ min: 2 }),
  ...validateLogin(),
];

const validatePasswordResetInit = () => [email, validate];

const validateResetPassword = () => [
  password,
  body('token').trim().notEmpty().withMessage('Invalid/missing reset token'),
  param('userId').trim().isUUID().withMessage('Invalid request parameters'),
  validate,
];

const validateFileUpload = () => [
  body('image')
    .custom((value, { req }) => req.file.mimetype.includes('image'))
    .withMessage('This file type is not supported'),
  validate,
];

export default {
  validateLogin,
  validateRegister,
  validatePasswordResetInit,
  validateResetPassword,
  validateFileUpload,
};
