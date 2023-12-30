const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Create a new message
router.post('/create', async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    console.log(`Sender: ${sender}, Receiver: ${receiver}, Text: ${text}`);
    const message = new Message({ sender, receiver, text });
    await message.save();

    // Add the message to the conversation's messages array
    const conversation = await Conversation.findOne({ participants: { $all: [sender, receiver] } });
    if (conversation) {
      conversation.messages.push(message);
      await conversation.save();
    }

    // Log relevant data for debugging
    console.log('Request data:', req.body);
    console.log('Conversation object:', conversation);
    res.status(201).json({ message: 'Message created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Fetch messages for a conversation
router.get('/fetchMessages/:sourceUser/:partnerUsername', async (req, res) => {
  try {
    const { sourceUser, partnerUsername } = req.params;
    console.log(`Source User: ${sourceUser}, Partner Username: ${partnerUsername}`);
    console.log(`Length of Source User: ${sourceUser.length}, Length of Partner Username: ${partnerUsername.length}`);

    
    // Check the format of the variables before using them as ObjectIds
    // console.log('Source User as ObjectId:', new mongoose.Types.ObjectId(sourceUser));
    // console.log('Partner Username as ObjectId:', new mongoose.Types.ObjectId(partnerUsername));
    

    const messages = await Message.find({ 
      $or: [
        { sender:sourceUser, receiver:partnerUsername },
        { sender:partnerUsername, receiver:sourceUser }
      ]
    }).populate('sender', 'username');
    console.log('Fetched Messages:', messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});


// Delete a message by ID
router.delete('/deleteMessage/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

module.exports = router;