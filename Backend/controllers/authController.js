const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Admin = require('../models/Admin');

const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const { type } = req.params;
    // console.log(type);

    let user;
    switch(type) {
      case 'student':
        user = await Student.findOne({ email });
        break;
      case 'company':
        user = await Company.findOne({ email });
        break;
      case 'admin':
        user = await Admin.findOne({ email });
        break;
      default:
        return res.status(400).json({ error: 'Invalid login type' });
    }

    if (!user) return res.status(400).json({ error: 'Email not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, type },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };