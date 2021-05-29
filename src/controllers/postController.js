import postService from '../services/postService';
import errorHandler from '../helpers/errorHandler';

const { handleControllerError } = errorHandler;

/**
 * Get a post by Id
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @returns {Response} express response object
 */
const getPost = (req, res) =>
  handleControllerError(res, async () => {
    const { id } = req.params;
    const { success, data, code, message } = await postService.getPostById(id);
    if (success) {
      return res.json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  });

/**
 * Get a post by Id
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @returns {Response} express response object
 */
const getAllPosts = (req, res) =>
  handleControllerError(res, async () => {
    const { success, data, code, message } = await postService.getAllPosts();
    if (success) {
      return res.json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  });

/**
 * Publish a post
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @returns {Response} express response object
 */
const publishPost = (req, res) =>
  handleControllerError(res, async () => {
    const { body } = req;
    const { success, data, code, message } = await postService.createPost({
      ...body,
      userId: req.user.id,
      published: body.published === 'true',
    });
    if (success) {
      return res.status(code).json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  });

/**
 * Edit a post
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @returns {Response} express response object
 */
const editPost = (req, res) =>
  handleControllerError(res, async () => {
    const {
      body,
      params: { id },
    } = req;
    body.id = id;
    if (body.published) {
      body.published = JSON.parse(body.published);
    }
    const { success, data, code, message } = await postService.editPost(body);
    if (success) {
      return res.status(code).json({ status: true, data });
    }
    return res.status(code).json({ status: false, message });
  });

/**
 * Like and unlike a post
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @returns {Response} express response object
 */
const likePost = (req, res) =>
  handleControllerError(res, async () => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { success, data, code, message } = await postService.likePost(
      id,
      userId
    );
    if (success) {
      return res.status(code).json({ status: true, data, message });
    }
    return res.status(code).json({ status: false, message });
  });

/**
 * Delete a post by id
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @returns {Response} express response object
 */
const deletePost = (req, res) =>
  handleControllerError(res, async () => {
    const { id } = req.params;
    const { success, data, code, message } = await postService.deletePostById(
      id
    );
    if (success) {
      return res.status(code).json({ status: true, data, message });
    }
    return res.status(code).json({ status: false, message });
  });

export { getPost, getAllPosts, publishPost, editPost, likePost, deletePost };
