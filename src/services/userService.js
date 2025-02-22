const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');


// ----------------------------------------- REGISTER -----------------------------------------
const registerUser = async (username, email, password) => {

    // Convert username and email to lowercase
    username = username.toLowerCase();
    email = email.toLowerCase();

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return newUser;
};


// ----------------------------------------- LOGIN -----------------------------------------

const loginUser = async (username, password, session) => {

    // Check if another user is already logged in
    if (session.user) {
        throw new Error('Another user is already logged in. Please log out first.');
    }

    // Convert username to lowercase for case-insensitive search
    const lowercasedUsername = username.toLowerCase();

    // Find user case-insensitively by lowercased username
    const user = await User.findOne({
        username: { $regex: `^${lowercasedUsername}$`, $options: "i" }
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Generate a JWT token
    const token = jwt.sign(
        { userId: user._id, username: user.username }, // Payload (keep original username in JWT)
        process.env.JWT_SECRET,                        // Secret key
        { expiresIn: '1h' }                            // Expiration time
    );

    // Store the token and user details in the session    
    session.token = token;
    session.user = { userId: user._id, username: user.username }; // Store original case in session

    return { token, user };
};


// ----------------------------------------- LOGOUT -----------------------------------------
const logoutUser = async (session) => {

    return new Promise((resolve, reject) => {
        session.destroy((err) => {
            if (err) {
                reject(new Error('Logout failed'));
            } else {
                resolve();
            }
        });
    });
};


module.exports = { registerUser, loginUser, logoutUser };
