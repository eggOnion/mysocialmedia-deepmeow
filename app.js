const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const { authenticater } = require('./src/middleware/authMiddleware');

const app = express();
app.use(express.json());

// CORS setup to allow all origins dynamically
app.use(cors({
  origin: function(origin, callback) {
    // Allow all origins by setting the header dynamically
    // This is required when `credentials: true` is enabled
    callback(null, true);  // Allow request from any origin
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,  // Allow credentials (cookies, sessions) 
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Set up MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose.set('strictQuery', false);

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { 'dbName': 'SocialDB' });

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Session management configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',  // Only true in production (HTTPS)
    httpOnly: true,  // Prevent JavaScript access to cookies
    sameSite: 'Lax'  // Can be 'Strict' or 'None' for stricter cookie policies
  }
}));

// Set headers for CORS handling on each request (important for preflight checks)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);  // Set dynamically for all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials

  // Handle preflight requests (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);  // Return 204 (No Content) for preflight OPTIONS request
  }

  next();
});

// Serve the HTML file for the root route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));


const userRoutes = require('./src/routes/userRoutes');
app.use('/users', userRoutes);

const postRoutes = require('./src/routes/postRoutes');
app.use('/', postRoutes);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
