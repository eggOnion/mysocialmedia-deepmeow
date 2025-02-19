const postService = require('../services/postService');
const logger = require('../utils/logger');


// ----------------------------------------- GET all Posts -----------------------------------------
const viewAllPosts = async (req, res) => {
  try {
    logger.info(`Incoming Request: ${req.method} ${req.url}`);
    const posts = await postService.viewAllPosts();
    logger.info("Response 200: Posts retrieved successfully");
    
    res.status(200).json({ message: 'Posts retrieved successfully', posts });
  } catch (error) {
    logger.error(`catch Unable to fetct all Posts: ${error.message}`);
    // console.error('Error fetching posts:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};


// ----------------------------------------- POST comments -----------------------------------------
const createPost = async (req, res) => {
  try {
    logger.info(`Incoming request: ${req.method} ${req.path}`); // Log request start

    // Ensure req.user exists and has a valid userId
    if (!req.user || !req.user.userId) {
      logger.warn(`Unauthorized access attempt from IP: ${req.ip}`);
      logger.info(`Response 403: Unauthorized access attempt for user (IP: ${req.ip})`);
      return res.status(403).json({ message: 'Unauthorized: Missing user ID' });
    }

    const { text } = req.body;
    const userId = req.user.userId;
    const username = req.user.username;

    logger.info(`Creating post for user: ${username} (ID: ${userId})`);
    const newPost = await postService.createPost(userId, username, text);
    logger.info(`Response 201: Post created successfully for user ${username} with post ID: ${newPost._id}`);

    // Respond with success message
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    logger.error(`Response 500: Error creating post - ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to create post' });
  }
};


// ----------------------------------------- UPDATE comments -----------------------------------------
const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const userId = req.user.userId;
    const username = req.user.username;  // Capture username

    logger.info(`Incoming Request: ${req.method} ${req.url} - User: ${username} (ID: ${userId}) is updating Post: ${postId}`);
    const updatedPost = await postService.updatePost(postId, userId, text);
    logger.info(`Response 200: Post updated successfully - Post ID: ${postId}, User: ${username} (ID: ${userId})`);

    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    logger.error(`Response 500: Error updating post - Post ID: ${req.params.postId}, User: ${req.user?.username || 'Unknown'} (ID: ${req.user?.userId || 'Unknown'}): ${error.message}`);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};


// ----------------------------------------- DELETE comments -----------------------------------------
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    logger.info(`Incoming request: ${req.method} ${req.path} - User: ${req.user.username} (ID: ${userId}) is deleting Post: ${postId}`);
    const deletedPost = await postService.deletePost(postId, userId);
    logger.info(`Response 204: Post deleted successfully - Post ID: ${postId}, User: ${req.user.username} (ID: ${userId})`);

    res.status(204).json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    logger.error(`Response 500: Error deleting post - Post ID: ${req.params.postId}, User: ${req.user?.username || 'Unknown'} (ID: ${req.user?.userId || 'Unknown'}): ${error.message}`);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};


module.exports = { createPost, viewAllPosts, updatePost, deletePost };