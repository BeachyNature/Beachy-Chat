// auth_routes.js

const express = require('express');
const router = express.Router();
module.exports = router;

// Grab models
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Login Function
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', req.body);
  const allUsers = await User.find({});
  console.log('All users:', allUsers);

  try {
    // Check if the user exists
    console.log('Query:', { username });
    const user = await User.findOne({ username }).catch(error => {
      console.error('Error finding user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password',
      });
    }

    console.log(password)
    console.log(user.password)

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password).catch(error => {
      console.error('Error comparing passwords:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    });

    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password',
      });
    }

    // Additional checks after successful login
    if (!user.isVerified) {
      console.log('User not verified');
      return res.status(401).json({
        status: 'error',
        message: 'User not verified. Please verify your email.',
      });
    }

    // Additional checks, validations, or token generation can be done here

    console.log('Login successful');
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.',
    });
  }
});
