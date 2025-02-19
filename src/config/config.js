require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  sessionSecret: process.env.SESSION_SECRET
};
