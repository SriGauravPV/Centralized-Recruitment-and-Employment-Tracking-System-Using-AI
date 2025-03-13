const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const register = async (req, res) => {
  // console.log("hi")
  try {
    const emailExists = await Student.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const student = new Student({
      ...req.body,
      password: hashedPassword
    });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register };