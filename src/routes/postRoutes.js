const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const Post = require("../models/postModel");
const { authenticateJWT } = require('../middleware/authMiddleware');


router.get('/viewAllPosts', postController.viewAllPosts);
router.post('/posts', authenticateJWT, postController.createPost);
router.put('/posts/:postId', authenticateJWT, postController.updatePost);
router.delete('/posts/:postId', authenticateJWT, postController.deletePost);

module.exports = router;


// Protect all routes with authenticateJWT middleware
// router.use(authenticateJWT);
// console.log('Middleware:', authenticateJWT);
