// server.js
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt'); 
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const User = require('./models/User')
const changePassRouter = require('./routes/change_pass');
const authRoutes = require('./routes/auth_routes');

const app = express();
const port = 3001;

// Use routes
app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/change_pass', changePassRouter);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Change 'views' to your actual views folder

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// Setup server
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/my-react-app';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


//  Register user account
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already exists. Choose a different username.',
      });
    }

    // Generate the verification token
    const verificationToken = generateVerificationToken();

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ username, password: hashedPassword, email, verificationToken });
    await newUser.save();

    sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Check your email for verification.',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      status: 'error',
      message: `Registration failed: ${error.message || 'Unknown error'}`,
    });
  }
});


// Verify Token
app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid verification token. Please check the link or register again.',
      });
    }

    // Update user status as verified (you can set a field like 'isVerified' to true)
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Email verification successful. You can now login.',
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      status: 'error',
      message: 'Email verification failed. Please try again.',
    });
  }
});


// Genreate Verification Token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}


// Send the verification email for the user that signs up
function sendVerificationEmail(email, verificationToken) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // replace with your email
      pass: process.env.EMAIL_PASSWORD, // replace with your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `<p>Click the following link to verify your email: <a href="http://localhost:3001/verify/${verificationToken}">Verify Email</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
}


// Show what port is being loaded
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
