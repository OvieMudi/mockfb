import { body, validationResult } from 'express-validator';

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

const validateLogin = () => [
  body('email').trim().normalizeEmail({ gmail_remove_dots: false }).isEmail(),
  body('password').trim().isLength({ min: 6 }),
  validate,
];

const validateRegister = () => [
  body('name').trim().isLength({ min: 2 }),
  ...validateLogin(),
];

const phoneSyncValidation = () => [body('user_contacts').isArray()];

const updateUserValidation = () => [
  body('email').optional({ checkFalsy: true }).isEmail(),
];

const loanValidation = () => [
  body('recipient_phone').isInt({ min: 1 }),
  body('recipient_phone').isLength({ min: 14 }),
  body('amount').isInt({ min: 1 }),
];

const phoneValidation = () => [
  body('phone').isInt({ min: 1 }),
  body('phone').isLength({ min: 14 }),
];

const emailValidation = () => [body('email').isEmail()];

const BVNValidation = () => [
  body('number').isInt({ min: 1 }),
  body('number').isLength({ min: 10 }),
];

const loanRequestValidation = () => [
  body('provider_phone').isInt({ min: 1 }),
  body('provider_phone').isLength({ min: 14 }),
  body('amount').isInt({ min: 1 }),
];

const approveLRValidation = () => [
  body('recipient_phone').isInt({ min: 1 }),
  body('recipient_phone').isLength({ min: 14 }),
];

export default {
  validateLogin,
  validateRegister,
  phoneSyncValidation,
  updateUserValidation,
  loanValidation,
  phoneValidation,
  BVNValidation,
  loanRequestValidation,
  approveLRValidation,
  emailValidation,
};
