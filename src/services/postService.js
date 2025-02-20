const Post = require('../models/postModel');
// const logger = require('../utils/logger');


// ----------------------------------------- GET All comments -----------------------------------------
const viewAllPosts = async () => {
  
  const posts = await Post.find().sort({ createdAt: -1 });

  if (!posts.length) {
    throw new Error('No posts found');
  }

  return posts;
};


// ----------------------------------------- POST comments -----------------------------------------
const createPost = async (userId, username, text) => {

  // Validate the post content
  if (!text || typeof text !== 'string') {
    throw new Error('Please provide valid post content');
  }

  // Create a new post
  const newPost = new Post({
    userId,
    username,
    text,
  });

  // Save the post to MongoDB
  await newPost.save();

  return newPost;
};


// ----------------------------------------- UPDATE comments -----------------------------------------
const updatePost = async (postId, userId, text) => {

  // Find the post by ID and ensure it belongs to the authenticated user
  const post = await Post.findOne({ _id: postId, userId });

  if (!post) {
    throw new Error('Post not found or unauthorized');
  }

  // Update post content and last modified time
  post.text = text;
  post.updatedAt = new Date();

  // Save changes to the database
  await post.save();

  return post;
};


// ----------------------------------------- DELETE comments -----------------------------------------
const deletePost = async (postId, userId) => {

  // Find the post by ID
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error('Post not found');
  }

  // Check if the authenticated user owns the post
  if (post.userId.toString() !== userId) {
    throw new Error('Unauthorized: You can only delete your own posts');
  }

  // Delete the post
  await Post.findByIdAndDelete(postId);

  return post;
};


module.exports = { viewAllPosts, createPost, updatePost, deletePost };
