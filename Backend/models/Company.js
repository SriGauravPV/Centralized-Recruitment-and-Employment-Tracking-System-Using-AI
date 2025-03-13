const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  website: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyDescription: String,
  phoneNumber: String,
  country: String,
  profilePictureUrl: String
});

module.exports = mongoose.model('Company', companySchema);