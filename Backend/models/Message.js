const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  fromType: {
    type: String,
    enum: ['student', 'admin', 'company'],
    required: true
  },
  to: {
    type: String,
    required: true
  },
  toType: {
    type: String,
    enum: ['student', 'admin', 'company'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Message', MessageSchema);