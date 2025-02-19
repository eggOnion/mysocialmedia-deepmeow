const userService = require('../services/userService');
const logger = require('../utils/logger');


// ----------------------------------------- REGISTER -----------------------------------------
const register = async (req, res) => {

    const { username, email, password } = req.body;

    try {
        logger.info(`Incoming request: ${req.method} ${req.path} - Registering user ${username}`);
        const newUser = await userService.registerUser(username, email, password);
        logger.info(`Response 201: User registered successfully: ${newUser.username} (ID: ${newUser._id})`);

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        // console.error(error);
        logger.error(`Response 400: Registration failed for ${username || 'unknown user'}: ${error.message}`);
        res.status(400).json({ message: error.message || 'Internal Server Error' });
    }
};


// ----------------------------------------- LOGIN -----------------------------------------
const login = async (req, res) => {
    const { username, password } = req.body;

    try {                
        logger.info(`Incoming request: ${req.method} ${req.path} - Login attempt for user: ${username}`);
        const { token, user } = await userService.loginUser(username, password, req.session);

        // Send token as HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        logger.info(`Response 200: User logged in successfully: ${user.username} (ID: ${user._id})`);

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {        
        // console.error(error);
        logger.error(`Response 400: Login failed for user ${username || 'unknown'}: ${error.message}`);
        res.status(400).json({ message: error.message || 'Internal Server Error' });
    }
};


// ----------------------------------------- LOGOUT -----------------------------------------
const logout = async (req, res) => {

    try {
        const username = req.session.user?.username || 'Unknown';
        logger.info(`Incoming request: ${req.method} ${req.path} - User logging out: ${username}`);

        await userService.logoutUser(req.session);
        res.clearCookie('token');
        logger.info(`Response 200: User ${username} logged out successfully`);

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        // console.error('Error during logout:', error);
        logger.error(`Response 500: Logout failed for user ${req.session.user?.username || 'Unknown'} - Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    register,
    login,
    logout,
};
