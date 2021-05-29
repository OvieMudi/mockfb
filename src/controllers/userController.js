import userService from '../services/userService';
import errorHandler from '../helpers/errorHandler';

const { handleControllerError } = errorHandler;
const { SERVER_URL } = process.env;

const getUsers = (req, res) =>
  handleControllerError(res, async () => {
    const { success, data, code, message } = await userService.getAllUsers();
    if (success) {
      return res.json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  });

const createUser = (req, res) =>
  handleControllerError(res, async () => {
    const { success, data, code, message } = await userService.createUser(
      req.body
    );
    if (success) {
      return res.status(code).json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  });

const loginUser = (req, res) =>
  handleControllerError(res, async () => {
    const { success, data, code, message } = await userService.loginUser(
      req.body
    );
    if (success) {
      return res.json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  });

/**
 * Initiate password reset controller
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @returns {Response} express response object
 */
const initPasswordReset = (req, res) =>
  handleControllerError(res, async () => {
    const { email } = req.body;
    await userService.initPasswordReset(email);
    return res.status(200).json({
      status: true,
      message: 'We sent you an email with a password reset link',
    });
  });

/**
 * Handle password reset controller
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @returns {Response} express response object
 */
const resetPassword = (req, res) =>
  handleControllerError(res, async () => {
    const { userId } = req.params;

    if (req.method === 'GET') {
      const { tk } = req.query;
      return res.render('password_reset', {
        id: userId,
        token: tk,
        link: `${SERVER_URL}/v1/users/password-reset/${userId}`,
      });
    }

    const { token, password } = req.body;
    const { success, code, message } = await userService.resetPassword(
      userId,
      token,
      password
    );
    if (success) {
      return res.json({ status: true, message });
    }
    return res.status(code).json({ status: false, message });
  });

export { getUsers, createUser, loginUser, initPasswordReset, resetPassword };
