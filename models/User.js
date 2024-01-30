// user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetToken: String,
  profilePicture: Buffer, // Add this field for storing the profile picture
});

const User = mongoose.model('User', userSchema, 'user-info');

module.exports = User;
