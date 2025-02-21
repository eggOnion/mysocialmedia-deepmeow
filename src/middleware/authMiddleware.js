// const jwt = require('jsonwebtoken');
// const config = require('../config/config.js'); //this is needed
// // const logger = require('../utils/logger');

// const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// function authenticateJWT(req, res, next) {
//   const authHeader = req.header('Authorization'); 
//   const sessionToken = req.session.token; // Get session token
//   // const sessionToken = req.cookies.token; // Get cookie token

//   console.log(`auth: ${authHeader}`);
//   console.log(`sess: ${sessionToken}`);

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Access denied. No Bearer token provided.' });
//   }

//   const authToken = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

//   if (!authToken || !sessionToken) {
//     // logger.error("Response error 401: Access denied. No token found.");  
//     return res.status(401).json({ message: 'Access denied. No token found.' });
//   }

//   if (authToken !== sessionToken) {
//     // logger.error("Response error 403: Invalid token: Mismatch detected.");
//     return res.status(403).json({ message: 'Invalid token: Mismatch detected.' });
//   }

//   // Verify the JWT
//   jwt.verify(authToken, SECRET_KEY, (err, user) => {
//     if (err) {
//       // logger.error("Response error 403: Invalid token.");
//       return res.status(403).json({ message: 'Invalid token' });
//     }
//     req.user = user; // Attach decoded user info
//     next();
//   });
// };


// module.exports = {
//   authenticateJWT, 
// };

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

function authenticateJWT(req, res, next) {
    const authHeader = req.header('Authorization'); // Get Authorization header

    console.log(`🔑 Authorization Header: ${authHeader}`);

    // Check if the token is present in the Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No Bearer token provided.' });
    }

    const authToken = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    // Verify the JWT
    jwt.verify(authToken, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('❌ Invalid token:', err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user; // Attach decoded user info to request
        console.log('✅ User authenticated:', user);
        next();
    });
}

module.exports = { authenticateJWT };

