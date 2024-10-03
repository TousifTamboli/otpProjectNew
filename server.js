require('dotenv').config();  // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const bcrypt = require('bcrypt'); // For password hashing
const { User } = require('./models/User');  // MongoDB User model
const crypto = require('crypto'); // For generating token

// In-memory token storage for simplicity
let resetTokenStore = {};

// Create an express app (make sure to initialize `app` before using routes)
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer configuration for OTP emails using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Reset password routes
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Generate a unique token
    const token = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:3000/reset-password.html?token=${token}&email=${email}`;

    // Store the token temporarily
    resetTokenStore[email] = token;

    // Send the reset link via email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Please click the following link to reset your password: ${resetLink}`
    });

    res.send({ message: 'Password reset link sent to your email.' });
});

app.post('/reset-password', async (req, res) => {
    const { email, token, newPassword } = req.body;

    // Check if the token matches
    if (resetTokenStore[email] !== token) {
        return res.status(400).send({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    // Remove the token after use
    delete resetTokenStore[email];

    res.send({ message: 'Password reset successfully' });
});

// In-memory OTP storage for simplicity
let otpStore = {};

// User Registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    
    res.status(201).send({ message: 'User registered successfully!' });
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    // Send OTP via email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    });

    res.send({ success: true, message: 'OTP sent to your email!' });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
    try {
        const otp = req.body.otp;
        const email = Object.keys(otpStore).find(key => otpStore[key].toString() === otp.toString());

        if (email) {
            delete otpStore[email]; // OTP is valid, so remove it
            res.json({ success: true, message: 'OTP verified successfully!' });
        } else {
            res.json({ success: false, message: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
});

// Serve HTML files
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
