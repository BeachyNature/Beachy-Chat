// change_pass.js
require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const path = require('path');

// Get the reset page
router.get('/reset_pass/:token', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/reset_pass.html'));
});


// Forgot password page
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User with this email does not exist.',
        });
      }
  
      // Generate a reset token and store it in the user document
      const resetToken = generateResetToken();
      console.log('Generated Reset Token:', resetToken);
      user.resetToken = resetToken;
      await user.save();
  
      // Send the reset email
      sendPasswordResetEmail(email, resetToken);
  
      res.status(200).json({
        status: 'success',
        message: 'Password reset email sent. Check your email for instructions.',
      });
    } catch (error) {
      console.error('Error during forgot password:', error);
      res.status(500).json({
        status: 'error',
        message: 'Forgot password failed. Please try again.',
      });
    }
  });


// Handle POST requests to /request_change/:token
router.post('/request_change/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  console.log('Token from request:', token);
  console.log('New Password:', newPassword);

  try {
      // Find the user by the reset token
      const user = await User.findOne({ resetToken: token });
      console.log('User from database:', user);

      if (!user) {
          return res.status(404).json({
              status: 'error',
              message: 'Invalid or expired reset token.',
          });
      }

      // Ensure newPassword is a valid string
      if (typeof newPassword !== 'string') {
          return res.status(400).json({
              status: 'error',
              message: 'Invalid new password.',
          });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Use the desired number of rounds

      // Update the user's password
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();

      // Respond with a success message
      res.status(200).json({
        status: 'success',
        message: 'Password reset successful. You can now log in with your new password.',
      });
  
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({
          status: 'error',
          message: 'Password reset failed. Please try again.',
      });
  }
});


// Generate reset token
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}


// Send password reset link
function sendPasswordResetEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.EMAIL_USER, // replace with your email
          pass: process.env.EMAIL_PASSWORD, // replace with your email password
      },
  });

  // Inside sendPasswordResetEmail function in change_pass.js
  const mailOptions = {
      from: 'beachychat@gmail.com',
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the following link to reset your password: <a href="http://localhost:3001/change_pass/reset_pass/${resetToken}">Reset Password</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending password reset email:', error);
      } else {
          console.log('Password reset email sent:', info.response);
      }
  });

  
}

module.exports = router;
