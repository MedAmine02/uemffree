const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  likeCount: {
    type: Number,
    default: 0
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  likers: {
    type: [String],
    default: []
  }
  // Additional fields if needed
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
