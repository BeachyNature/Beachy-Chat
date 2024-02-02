require('dotenv').config();

// User Model
const User = require('./models/User');

// Connected server 
const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Database builder and node mailer
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');

// Connected routes
const changePassRouter = require('./routes/change_pass');
const authRoutes = require('./routes/auth_routes');

// File load in
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for buffer
const upload = multer({ storage: storage });
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

// File size limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Connect socket for messages
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// Use routes
app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/change_pass', changePassRouter);
app.use('/uploads', express.static('uploads'));
app.use('/profilePictures', express.static(path.join(__dirname, 'public', 'profilePictures')));
app.use(express.static(path.join(__dirname, 'src')));
app.use(fileUpload());


// Example of increasing the file size limit (adjust according to your needs)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Setup server
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/my-react-app';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });



// WebSocket server
const users = new Map(); // Map to store connected users
io.on('connection', (socket) => {
  socket.on('joinChatRoom', (data) => {
    const { username } = data;
    console.log('User joined chat room:', username);
    users.set(socket.id, username);

    // Emit userJoined event only to the user who joined
    socket.emit('userJoined', { username, message: 'You have joined the chat.' });

    // Broadcast to others that a new user has joined
    socket.broadcast.emit('userJoined', { username, message: 'has joined the chat.' });

    // Update user list and broadcast to all users
    const userList = Array.from(users.values());
    console.log(userList);
    io.emit('userList', userList); // Emit the updated user list to all clients

  });

  socket.on('sendMessage', ({ username, message }) => {
    console.log('Received message:', { username, message });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userList', Array.from(users.values())); // Emit updated user list to all clients
    io.emit('userLeft', { username, message: 'has left the chat.' });
    console.log('User disconnected:', username);
  });
});


// Register user account
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    
    //Check if there is an existing user
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

    // Default image 
    const defaultImagePath = path.join(__dirname, 'public', 'default.jpg');
    const defaultImageBuffer = await readFileAsync(defaultImagePath);
    
    // Save the new user to the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: defaultImageBuffer,
      verificationToken,
    });
    await newUser.save();

    // Send user verfiication email
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


// Handle file upload
app.post('/upload', upload.single('profileImage'), async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const profileImage = req.file.buffer;

  if (!profileImage) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's profileImage
    user.profileImage = profileImage;

    // Save the updated user to the database
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating user profile image:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



// Load image
app.get('/loadImage', async (req, res) => {
  try {
    console.log('Received request to load image');

    const user = await User.findOne();

    if (!user || !user.profileImage) {
      console.log('User or profile image not found');
      return res.status(404).json({ error: 'User or profile image not found' });
    }

    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(user.profileImage);
  } catch (error) {
    console.error('Error loading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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


// Change Password
app.post('/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect.',
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      status: 'error',
      message: `Password change failed: ${error.message || 'Unknown error'}`,
    });
  }
});


// Generate Verification Token
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
    html: `<p>Click the following link to verify your email: <a href="http://localhost:5000/verify/${verificationToken}">Verify Email</a></p>`,
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
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});