const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  intro: String,
  dob: Date,
  qualification: String,
  stream: String,
  address: String,
  city: String,
  state: String,
  skills: String,
  resumeUrl: String,
  tenthmarks: Number,
  twelthmarks: Number,
  ugmarks: Number,
  pgmarks: Number,
  aboutMe: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('Student', studentSchema);