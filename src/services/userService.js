const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');


// ----------------------------------------- REGISTER -----------------------------------------
const registerUser = async (username, email, password) => {

     // Convert username & email to lowercase for checking
     const existingUser = await User.findOne({
        $or: [
            { username: { $regex: `^${username}$`, $options: "i" } }, 
            { email: { $regex: `^${email}$`, $options: "i" } }
        ]
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save username and email as they are (original case)
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

    // Find user case-insensitively
    const user = await User.findOne({ 
        username: { $regex: `^${username}$`, $options: "i" } 
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
        { userId: user._id, username: user.username }, // Payload
        process.env.JWT_SECRET,                        // Secret key
        { expiresIn: '1h' }                            // Expiration time
    );

    // Store the token and user details in the session    
    session.token = token;
    session.user = { userId: user._id, username: user.username };

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
