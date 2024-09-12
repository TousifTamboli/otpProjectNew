const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Store OTP and email for simplicity (in-memory)
let otpStore = {};

// Initialize express app
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Email Sending Logic using Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can replace this with any email service
    auth: {
        user: 'tousiftamboli3@gmail.com',   // Your email
        pass: 'cpmssonilgmklmbs'     // Your email password or App password
    }
});

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
    const email = req.body.email;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP with email
    otpStore[email] = otp;

    // Set up email options
    const mailOptions = {
        from: 'tousiftamboli3@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otp}`
    };

    // Send the email with OTP
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json({ success: false, message: 'Error sending email. Try again.' });
        }
        res.json({ success: true, message: 'OTP sent to your email.' });
    });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
    const otp = req.body.otp;
    const email = Object.keys(otpStore).find(key => otpStore[key] == otp);

    if (email) {
        delete otpStore[email];  // OTP is valid, so remove it
        res.json({ success: true, message: 'OTP verified successfully!' });
    } else {
        res.json({ success: false, message: 'Invalid OTP. Please try again.' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
