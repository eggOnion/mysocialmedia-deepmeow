const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: String
},
    { timestamps: true }
);

// Create case-insensitive index
userSchema.index({ username: 1 }, { collation: { locale: 'en', strength: 2 } });
userSchema.index({ email: 1 }, { collation: { locale: 'en', strength: 2 } });


module.exports = mongoose.model('User', userSchema);