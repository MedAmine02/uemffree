// models/Message.js
const mongoose = require('mongoose');
const User = require('./User'); 

const messageSchema = new mongoose.Schema({
  receiver: { type: String, ref: 'User' },
  sender: { type: String, ref: 'User' },
  text: String,
  timestamp: { type: Date, default: Date.now },
  isSeen: Boolean,
});

module.exports = mongoose.model('Message', messageSchema);
