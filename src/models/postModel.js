const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    username: { type: String, required: true }, // Capturing the username of the post owner
    text: { type: String, required: true }, // Post content
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('Post', postSchema);
