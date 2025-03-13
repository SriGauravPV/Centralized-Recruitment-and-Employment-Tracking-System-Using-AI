const bcrypt = require('bcryptjs');
const multer = require('multer');
const Company = require('../models/Company');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const register = async (req, res) => {
  try {
    // console.log("Received file:", req.file);
    // console.log("Received body:", req.body);

    const { email, password, ...otherData } = req.body;

    const emailExists = await Company.findOne({ email });
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const companyData = {
      ...otherData,
      email,
      password: hashedPassword,
      logo: req.file ? req.file.filename : '' // Save profile picture filename
    };

    const company = new Company(companyData);
    await company.save();
    res.status(201).json({ message: 'Company registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register: [upload.single('profilePicture'), register] };
