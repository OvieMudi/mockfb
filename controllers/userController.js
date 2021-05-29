import log from '../helpers/log';
import userService from '../services/userService';

const getUsers = async (req, res) => {
  try {
    const { success, data, code, message } = await userService.getAllUsers();
    if (success) {
      return res.json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  } catch (error) {
    log(error);
    return res
      .status(422)
      .json({ status: false, message: 'Cannot proccess request' });
  }
};

const createUser = async (req, res) => {
  try {
    const { success, data, code, message } = await userService.createUser(
      req.body
    );
    if (success) {
      return res.status(code).json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  } catch (error) {
    log(error);
    return res
      .status(422)
      .json({ status: false, message: 'Cannot proccess request' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { success, data, code, message } = await userService.loginUser(
      req.body
    );
    if (success) {
      return res.json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  } catch (error) {
    log(error);
    return res
      .status(422)
      .json({ status: false, message: 'Cannot proccess request' });
  }
};

export { getUsers, createUser, loginUser };
