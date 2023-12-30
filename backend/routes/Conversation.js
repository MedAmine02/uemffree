const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const mongoose = require('mongoose'); 
const User = require('../models/User');
const { ObjectId } = require('mongodb');
//const onConnected = require('../socket');
const player = require('play-sound')();
//const { getIO } = require('../socket');







//=========================


router.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Extract user ID from request
      const conversations = await Conversation.find({ participants: userId })
        .populate('participants', 'username') // Populate participants with usernames
        .sort({ 'messages.timestamp': -1 }); // Sort by most recent messages
      
        
     
        res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } );


  router.post('/create', async (req, res) => {
    try {
      const senderId = req.body.senderId;
      const receiverId = req.body.receiverId;
  
      // Check if senderId and receiverId are valid ObjectId strings
      if (!ObjectId.isValid(senderId) || !ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: 'Invalid senderId or receiverId' });
      }
  
      const senderUser = await User.findById(senderId);
      const receiverUser = await User.findById(receiverId);
  
      if (!senderUser || !receiverUser) {
        return res.status(404).json({ message: 'Sender or receiver not found' });
      }
  
      const participants = [
        { username: senderUser.username, userId: senderUser._id },
        { username: receiverUser.username, userId: receiverUser._id }
      ];
      const messages = []; // Initialize the messages array
  
      const conversation = new Conversation({ participants, messages });
      await conversation.save();
  
      res.status(201).json(conversation); // Return the created conversation as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create a new conversation. Please check your input data' });
    }
  });
  
  
  


  router.post('/:conversationId/add-message', async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const { senderId, content } = req.body;
  
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
  
      // Update to emit message to specific conversation
      io.to(conversationId).emit('chat-message', { senderId, content });
  
      conversation.messages.push({ sender: senderId, content });
      await conversation.save();
  
      console.log(`Message added to conversation ${conversationId} by user ${senderId}`);
      res.status(201).json({ message: 'Message added successfully' });
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

  //for getting the senderId 
  router.get('/:conversationId/first-participant-id', async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      const firstParticipantId = conversation.participants[0]._id;
      res.status(200).json({ firstParticipantId });
    } catch (error) {
      console.error('Error fetching first participant ID:', error);
      res.status(500).json({ message: 'Failed to fetch first participant ID' });
    }
  });
  

  

  router.get('/:conversationId/messages', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const senderUsername = req.query.senderUsername;
        const receiverUsername = req.query.receiverUsername;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: { $all: [senderUsername, receiverUsername] }
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        console.log('Fetching messages for conversation ID:', conversationId);
        console.log('Messages:', conversation.messages);

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

// Start conversation route
router.post('/startConversation', (req, res) => {
  const { senderUsername, receiverUsername } = req.body;
  const participants = [senderUsername, receiverUsername].sort().join('');
  const conversationId = participants; // Implement your logic here to start a conversation

  console.log(`Conversation started between ${senderUsername} and ${receiverUsername}. Conversation ID: ${conversationId}`);

  // Example response
  res.status(200).json({ success: true, message: 'Conversation started successfully.', conversationId });
});


 



router.get('/getConversationId/:senderUsername/:receiverUsername', async (req, res) => {
  try {
    const senderUsername = req.params.senderUsername;
    const receiverUsername = req.params.receiverUsername;


    // Create a conversation ID that is consistent for both sender and receiver
    //const conversationId = [senderUsername, receiverUsername].sort().join('');

    const conversationId= new ObjectId();


    
    // const conversation = await Conversation.findOne({
    //   participants: { $all: [senderUsername, receiverUsername] }
    // });

    // if (!conversation) {
    //   return res.status(404).json({ message: 'Conversation not found' });
    // }

    // const conversationId = conversation._id;

    console.log('Fetching conversation ID for', senderUsername, 'and', receiverUsername);
    console.log('Fetched conversation ID:', conversationId);

    res.status(200).json({ conversationId: conversationId.toHexString() });
  } catch (error) {
    console.error('Error fetching conversation ID:', error);
    res.status(500).json({ message: 'Failed to fetch conversation ID' });
  }
});






router.delete('/:conversationId',async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      await Conversation.findByIdAndDelete(conversationId);
      res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });


// New route for checkConversationExists
router.get('/check/:senderId/:receiverId', async (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
  
    try {
      const conversationExists = await  Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });
  
      res.status(200).json({ exists: conversationExists });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });


// New route for fetchConversationsAndUpdateDrawer
router.get('/fetch/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const conversations = await Conversation.find({
      participants: { $elemMatch: { userId } },
    }).populate('participants', 'username');

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

module.exports = router;
