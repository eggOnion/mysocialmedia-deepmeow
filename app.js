const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const { authenticater } = require('./src/middleware/authMiddleware');

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://eggOnion.github.io", // Explicitly define frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow credentials (cookies, sessions) 
  allowedHeaders: ["Content-Type", "Authorization"]
}));


const PORT = process.env.PORT || 5000;
mongoose.set('strictQuery', false);

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { 'dbName': 'SocialDB' });

app.use(express.urlencoded({ extended: true }));

//Use this settings when using localhost:3000
//app.use(express.urlencoded({ extended: true }));
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false, httpOnly: true, sameSite: 'Lax' }
// }));


app.use((req, res, next) => {
  // const allowedOrigins = ["https://eggOnion.github.io", "http://localhost:3000"];
  // if (allowedOrigins.includes(req.headers.origin)) {
  //   res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  // }
  res.header("Access-Control-Allow-Origin", req.headers.origin); // No wildcard when credentials: true
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
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