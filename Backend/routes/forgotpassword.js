// Add this route to your auth routes file

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransport({
  // Replace with your email service configuration
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, type } = req.body;
    
    // Validate if this is a student account
    if (type !== 'student') {
      return res.status(400).json({ error: 'Invalid account type' });
    }
    
    // Find the student by email
    const student = await Student.findOne({ email });
    
    if (!student) {
      return res.status(404).json({ error: 'No account found with this email' });
    }
    
    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token expiration (1 hour)
    const resetTokenExpires = Date.now() + 3600000;
    
    // Update student with reset token info
    student.resetPasswordToken = resetToken;
    student.resetPasswordExpires = resetTokenExpires;
    await student.save();
    
    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: 'Password Reset Request',
      html: `
        <h2>REVA University Student Portal</h2>
        <p>You are receiving this email because you (or someone else) requested a password reset for your account.</p>
        <p>Please click on the following link to complete the process:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password route
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    
    // Find student with the reset token and check if it's valid
    const student = await Student.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!student) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }
    
    // Hash the new password
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);
    
    // Clear the reset token fields
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;
    
    await student.save();
    
    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: 'Your password has been changed',
      html: `
        <h2>REVA University Student Portal</h2>
        <p>This is a confirmation that the password for your account ${student.email} has just been changed.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/check-reset-token/:token', async (req, res) => {
    try {
      const { token } = req.params;
      
      // Find student with the reset token and check if it's valid
      const student = await Student.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      
      if (!student) {
        return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
      }
      
      res.status(200).json({ valid: true });
    } catch (error) {
      console.error('Check reset token error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;