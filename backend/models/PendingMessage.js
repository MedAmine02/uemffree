const mongoose = require('mongoose');

const pendingMessageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  time: String,
  // Additional fields if needed
});

module.exports = mongoose.model('PendingMessage', pendingMessageSchema);
