const express = require('express');
const router = express.Router();
const PendingMessage = require('../models/PendingMessage');


// Parse JSON request bodies
router.use(express.json());

// Route to add a pending message
router.post('/addPendingMessage', async (req, res) => {
  try {
    const { sender, message,time } = req.body;
    

    /*console.log('Received sender:', sender);
    console.log('Received message:', message);
    console.log('Received time:', time);
    */
    

    const pendingMessage = new PendingMessage({ sender, message, time });
    await pendingMessage.save();
    res.status(201).json(pendingMessage/*, {message: 'Pending Message Added successfully'}*/);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all pending messages
router.get('/getPendingMessages', async (req, res) => {
  try {
    const pendingMessages = await PendingMessage.find();
    const formattedMessages=pendingMessages.map(message=>{
        return {
            _id:message._id,
            username:message.sender,
            message:message.message,
            time:message.time,
        };
    });
    res.json(formattedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Implement other routes and functions as needed
// Route to delete a pending message
router.post('/deletePendingMessage', async (req, res) => {
  try {
    const { sender, message, time } = req.body;
    console.log('Received request data:', req.body);

    // Find and delete the pending message based on message details
    const result = await PendingMessage.findOneAndDelete({
      sender,
      message,
      time,
    });

    console.log('Deletion result:', result);
    if (!result) {
      // If no document was deleted, return a 404 Not Found response
      console.log('Message not found');
      res.status(404).json({ error: 'Message not found' });
    } else {
      // If a document was deleted successfully, return a 204 No Content response
      console.log('Message deleted successfully');
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a pending message
// router.post('/deletePendingMessage', async (req, res) => {
//   try {
//     const { sender, message, time } = req.body;
//     console.log('Received request data:', req.body);

//     // Printing the received data
//     console.log('Data received:');
//     console.log('Sender:', sender);
//     console.log('Message:', message);
//     console.log('Time:', time);

//     // Simulate the deletion process without actually deleting the data
//     console.log('Simulating deletion process...');

//     // Simulated result (no deletion performed)
//     const result = null;
//     console.log('Deletion result:', result);

//     // Always return a 204 No Content response for simulation purposes
//     res.sendStatus(204);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


module.exports = router;
