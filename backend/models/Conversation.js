const mongoose = require('mongoose');
const User = require('./User'); // Import the User model
const Message = require('./Message');

const conversationSchema = new mongoose.Schema({
  participants: [{
     username: String,
     userId:{ type:String, ref: 'User' }}],
  messages:  [{ type:String, ref: 'Message' }],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
