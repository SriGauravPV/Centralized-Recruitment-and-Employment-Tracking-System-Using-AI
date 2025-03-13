const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Student = require('../models/Student');
const Company = require('../models/Company');
// No auth middleware as per your request

// Get all inbox messages
router.get('/inbox', async (req, res) => {
  try {
    const { email, role } = req.query; // Get from query params
    
    if (!email || !role) {
      return res.status(400).json({ msg: 'Email and role are required' });
    }
    
    // Find messages where the user is the recipient
    const messages = await Message.find({ 
      to: email, 
      toType: role 
    }).sort({ date: -1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all sent messages
router.get('/sent', async (req, res) => {
  try {
    const { email, role } = req.query; // Get from query params
    
    if (!email || !role) {
      return res.status(400).json({ msg: 'Email and role are required' });
    }
    
    // Find messages where the user is the sender
    const messages = await Message.find({ 
      from: email, 
      fromType: role 
    }).sort({ date: -1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// IMPORTANT: This must come BEFORE the /:id route to prevent route conflicts
// Get available recipients
router.get('/recipients', async (req, res) => {
  try {
    const { role } = req.query;
    
    if (!role) {
      return res.status(400).json({ msg: 'Role is required' });
    }
    
    let recipients = [];
    
    // Get admin recipients (simplified - in a real app, you'd have an Admin model)
    const adminRecipients = [{
      _id: 'admin',
      name: 'Admin',
      email: 'admin@reva.edu',
      userType: 'admin'
    }];
    
    // Get student recipients
    const studentRecipients = await Student.find()
      .select('firstName lastName email')
      .lean();
    
    const formattedStudents = studentRecipients.map(student => ({
      _id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      userType: 'student'
    }));
    
    // Get company recipients
    const companyRecipients = await Company.find()
      .select('companyName email')
      .lean();
    
    const formattedCompanies = companyRecipients.map(company => ({
      _id: company._id,
      name: company.companyName,
      email: company.email,
      userType: 'company'
    }));
    
    // Add appropriate recipients based on user role
    if (role === 'student') {
      recipients = [...adminRecipients, ...formattedCompanies];
    } else if (role === 'company') {
      recipients = [...adminRecipients, ...formattedStudents];
    } else if (role === 'admin') {
      recipients = [...formattedStudents, ...formattedCompanies];
    }
    
    // Make sure we're returning an array, even if empty
    res.json(recipients || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    // In case of error, still return an empty array to prevent frontend errors
    res.json([]);
  }
});

// Get message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    // Check if message exists
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    // Check if user has permission to view this message
    const { email, role } = req.query; // Get from query params
    
    if (!email || !role) {
      return res.status(400).json({ msg: 'Email and role are required' });
    }
    
    if (
      (message.to !== email || message.toType !== role) && 
      (message.from !== email || message.fromType !== role)
    ) {
      return res.status(401).json({ msg: 'Not authorized to view this message' });
    }
    
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Send a new message
router.post('/', async (req, res) => {
  try {
    const { email, role, to, toType, subject, content } = req.body;
    
    if (!email || !role) {
      return res.status(400).json({ msg: 'Email and role are required' });
    }
    
    // Validate recipient exists
    let recipientExists = false;
    
    if (toType === 'admin') {
      // Simple admin validation - use the same email as in the recipients endpoint
      recipientExists = to === 'admin@reva.edu';
    } else if (toType === 'student') {
      const student = await Student.findOne({ email: to });
      recipientExists = !!student;
    } else if (toType === 'company') {
      const company = await Company.findOne({ email: to });
      recipientExists = !!company;
    }
    
    if (!recipientExists) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }
    
    // Create message
    const newMessage = new Message({
      from: email,
      fromType: role,
      to,
      toType,
      subject,
      content,
      read: false
    });
    
    const message = await newMessage.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Mark message as read
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    // Check if message exists
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    // Check if user is the recipient
    const { email, role } = req.body; // Get from request body
    
    if (!email || !role) {
      return res.status(400).json({ msg: 'Email and role are required' });
    }
    
    if (message.to !== email || message.toType !== role) {
      return res.status(401).json({ msg: 'Not authorized to mark this message as read' });
    }
    
    // Update message
    message.read = true;
    await message.save();
    
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    // Check if message exists
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    // Check if user has permission to delete
    const { email, role } = req.query; // Get from query params
    
    if (!email || !role) {
      return res.status(400).json({ msg: 'Email and role are required' });
    }
    
    if (
      (message.to !== email || message.toType !== role) && 
      (message.from !== email || message.fromType !== role)
    ) {
      return res.status(401).json({ msg: 'Not authorized to delete this message' });
    }
    
    // Use deleteOne instead of remove (which is deprecated)
    await Message.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Message deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;