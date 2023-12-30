const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const universityRoute = require('./routes/universityRoute');
const http = require('http');
const schedule = require('node-schedule');
const universityController = require('./controllers/University');
const conversationRoutes = require('./routes/Conversation');
const messageRoutes = require('./routes/Message');
const pendingMessagesRoutes = require('./routes/PendingMessages');
const chatRoutes = require('./routes/Chat');
const path = require('path');
const { getUserById } = require('./routes/authRoutes');
const { Server } = require('socket.io');
const app = express();
const { StreamChat } = require('stream-chat');
const server=http.createServer(app);


//=================================
const apiKey = 'bkktbdq62wh6';
const apiSecret = 'your-api-secret';

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

app.post('/generate-token', async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the user exists in your database (implement your user retrieval logic)
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate Stream Chat token for the user
    const token = serverClient.createToken(userId);

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    console.error('Error generating Stream Chat token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//===============

mongoose.connect('mongodb://127.0.0.1:27017/unirating', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


//app.use(express.json());
app.use(bodyParser.json());
//app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
var users={};

const messages = [];

// API endpoint for sending a message
app.post('/send-message', (req, res) => {
  const { sender, receiver, text } = req.body;
  const timestamp = new Date();
  const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

  // Store the message (you can modify this to use a database)
  messages.push({ sender, receiver, text, timestamp });

  // Delete messages older than a week
  const currentTime = new Date().getTime();
  for (let i = messages.length - 1; i >= 0; i--) {
    if (currentTime - messages[i].timestamp.getTime() > weekInMilliseconds) {
      messages.splice(i, 1);
    }
  }

  res.status(200).send('Message sent successfully');
});

// Schedule a job to delete old messages once a day (adjust the timing as needed)
const deleteOldMessagesJob = schedule.scheduleJob('0 0 * * *', () => {
  const currentTime = new Date().getTime();
  const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

  for (let i = messages.length - 1; i >= 0; i--) {
    if (currentTime - messages[i].timestamp.getTime() > weekInMilliseconds) {
      messages.splice(i, 1);
    }
  }
});



//====================================================



app.use('/university', universityRoute);
app.use('/university', universityController);
app.use('/auth', authRoutes);
// Use conversation routes
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);
app.use('/pendingMessages', pendingMessagesRoutes);
app.use('/chat', chatRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
