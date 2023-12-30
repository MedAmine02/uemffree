const Conversation = require('../models/Conversation');
const mongoose = require('mongoose'); 
const ObjectId = mongoose.Types.ObjectId;

exports.checkConversationExists= async (senderId, receiverId)=> {
  try {
    // Find a conversation where both participants match
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    return conversation !== null;
  } catch (error) {
    console.error(error);
    return false;
  }
}





// Fetch all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract user ID from request
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username') // Populate participants with usernames
      .sort({ 'messages.timestamp': -1 }); // Sort by most recent messages
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Create a new conversation
exports.createConversation=async(senderId, receiverId) =>{
  try {
     // Check if senderId and receiverId are valid ObjectId strings
     if (!ObjectId.isValid(senderId) || !ObjectId.isValid(receiverId)) {
      throw new Error('Invalid senderId or receiverId');
    }

    // Convert senderId and receiverId to ObjectId
    const senderObjectId = new ObjectId(senderId);
    const receiverObjectId = new ObjectId(receiverId);

    const participants = [senderObjectId, receiverObjectId];
    
    const conversation = new Conversation({ participants });
    await conversation.save();
    return conversation;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create a new conversation. Please check you input data');
  }
}



// Add a new message to a conversation
exports.addMessage = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const { senderId, content } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.messages.push({ sender: senderId, content });
    await conversation.save();
    res.status(201).json({ message: 'Message added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Delete a conversation by ID
exports.deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    await Conversation.findByIdAndDelete(conversationId);
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.fetchConversationsAndUpdateDrawer = async (userId) =>{
  try {
    // Fetch all conversations for the user
    const conversations = await Conversation.find({
      participants: userId,
    }).populate('participants', 'username');

    // You can send this list of conversations to your frontend to update the drawer
    return conversations;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch conversations');
  }
}


