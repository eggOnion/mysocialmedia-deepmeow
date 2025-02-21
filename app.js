const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const { authenticater } = require('./src/middleware/authMiddleware');

const app = express();
app.use(express.json());

// Allow only whitelisted frontend origins
const allowedOrigins = ["https://eggonion.github.io/deepmeow", "http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ["https://eggonion.github.io/deepmeow", "http://localhost:3000"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
  allowedHeaders: ["Content-Type", "Authorization"]
}));


const PORT = process.env.PORT || 5000;
mongoose.set('strictQuery', false);

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { 'dbName': 'SocialDB' });

app.use(express.urlencoded({ extended: true }));

// Use Secure Cookies for GitHub Pages (HTTPS)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, sameSite: 'Lax' } // secure: true ensures cookies work over HTTPS
}));

// CORS Middleware for Preflight Requests
app.use((req, res, next) => {
  const allowedOrigins = ["https://eggonion.github.io/deepmeow", "http://localhost:3000"];
  
  if (allowedOrigins.includes(req.headers.origin)) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Properly handle preflight requests
  }

  next();
});


// Insert your routing HTML code here.
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const userRoutes = require('./src/routes/userRoutes');
app.use('/users', userRoutes);

const postRoutes = require('./src/routes/postRoutes');
app.use('/', postRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
