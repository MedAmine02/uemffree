const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const PendingMessage = require('../models/PendingMessage');

// Route to post an accepted message from pending
router.post('/postMessage', async (req, res) => {
  try {
    const { sender, message, time } = req.body;
    const chatMessage = new ChatMessage({ sender, message, time });
    await chatMessage.save();
    
     // Remove the message from pending messages
    //  const result = await PendingMessage.deleteOne({ sender, message, time });
    
    //  if (result.deletedCount === 0) {
    //    return res.status(404).json({ error: 'Message not found in pending messages' });
    //  }
    
    res.status(201).json(chatMessage/*,{message: 'Message posted successfully'}*/);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// POST request to receive data
router.post('/testReceiveData', (req, res) => {
  const receivedData = req.body;
  console.log('Received data:', receivedData);
  res.status(200).json({ message: 'Data received successfully' , receivedData:receivedData});
});

// Route to show all posted messages
router.get('/getAllMessages', async (req, res) => {
  try {
    const messages = await ChatMessage.find();
   
    const formattedMessages = messages.map((message) => {
      return {
        _id: message._id,
        sender: message.sender,
        message: message.message,
        time: message.time,
        likeCount: message.likeCount,
        isLiked: message.isLiked,
        likers: message.likers,
      };
    });

    // console.log('Fetched messages: ', messages);
    // console.log('Formatted messages: ', formattedMessages);

    res.json(formattedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a pending message
router.delete('/deleteMessage/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PendingMessage.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      // If no document was deleted, return a 404 Not Found response
      res.status(404).json({ error: 'Message not found' });
    } else {
      // If a document was deleted successfully, return a 204 No Content response
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//======for the likers========

// Route to add a liker to the likers list
router.post('/addLiker', async (req, res) => {
  try {
    const { sender, message, time, username} = req.body;
    const existingMessage = await ChatMessage.findOne({ sender, message, time });
    let likers = existingMessage.likers || [];
    if (!likers.includes(username)) {
      likers.push(username);
      existingMessage.likeCount = likers.length;
    }
    const result = await ChatMessage.findOneAndUpdate(
      {sender, message, time},
      { $push: { likers: username } , $inc:{likeCount: 1}},
      { new: true }
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to remove a liker from the likers list
router.post('/removeLiker', async (req, res) => {
  try {
    const { sender, message, time, username} = req.body;
    const existingMessage = await ChatMessage.findOne({ sender, message, time });
    let likers = existingMessage.likers || [];
    if (likers.includes(username)) {
      likers = likers.filter(liker => liker !== username);
      existingMessage.likeCount = likers.length;
    }
    const result = await ChatMessage.findOneAndUpdate(
      {sender, message, time},
      { $pull: { likers: username } , $inc: { likeCount: -1}},
      { new: true }
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // Route to show all likers of a message
// router.get('/showLikers', async (req, res) => {
//   try {
//     const { sender, message, time } = req.body;
//     const result = await ChatMessage.findOne({sender, message, time});
//     if (result && result.likers) {
//       res.json(result.likers);
//     } else {
//       res.json([]); // Return an empty array if likers is null or not defined
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Route to show all likers of a message
router.get('/showLikers', async (req, res) => {
  try {
    const sender = req.query.sender;
    const message = req.query.message;
    const time = req.query.time;
    console.log("Requested sender:", sender);
    console.log("Requested message:", message);
    console.log("Requested time:", time);

    const result = await ChatMessage.findOne({sender, message, time});
    console.log("Result:", result);

    if (result && result.likers) {
      console.log("Likers:", result.likers);
      res.json(result.likers);
    } else {
      console.log("No likers found.");
      res.json([]); // Return an empty array if likers is null or not defined
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to check if the current user is liking a message
router.post('/isCurrentUserLikingMessage', async (req, res) => {
  try {
    const { sender, message, time, username } = req.body;
    const existingMessage = await ChatMessage.findOne({ sender, message, time });
    let likers = existingMessage.likers || [];
    res.json({ isLiked: likers.includes(username) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch likers' data based on sender, message, and time
router.post('/fetchLikersData', async (req, res) => {
  try {
    const { sender, message, time } = req.body;
    // Implement your logic to fetch likers' data based on the provided 'sender', 'message', and 'time'
    // Example implementation
    const likersData = await fetchLikersData(sender, message, time);
    res.status(200).json(likersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const fetchLikersData = async (sender, message, time) => {
  try {
    const chatMessage = await ChatMessage.findOne({ sender, message, time });
    if (!chatMessage) {
      throw new Error('Message not found');
    }
    return chatMessage.likers;
  } catch (error) {
    throw new Error('Failed to fetch likers data');
  }
};


// Implement other routes and functions as needed



module.exports = router;
