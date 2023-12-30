const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


async function getUserById(userId) {
  try {
    // Find the user by ID in the database
    const user = await User.findById(userId).select('-password');

    // Return the user object (excluding the 'password' field) or null if not found
    return user;
  } catch (error) {
    console.error("Fetch User by ID Error:", error);
    throw error; // Propagate the error to handle it appropriately
  }
}


// Signup route
router.post('/signup', async (req, res) => {
  //console.log('Request Body:', req.body);
  const { username, email, password, confirmPassword } = req.body;

  try {

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Password and confirmPassword are required' });
    }


    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

     // Generate a JWT token after successful signup
     const token = jwt.sign({ userId: user._id }, 'harr0255', { expiresIn: '1h' });


    res.status(201).json({ message: 'User registered successfully',token });
  } catch (error) {
    console.error("Signup Error:", error);
    //console.error(error.stack); 
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'harr0255', { expiresIn: '1h' });
    res.status(200).json({ token, username:user.username });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});


// Create a new route to fetch and display all users
router.get('/users', async (req, res) => {
  try {
    // Query the database to get all users
    const users = await User.find({}, '-password').select('username email age city university description'); // Excluding the 'password' field for security
    
    // Check if there are users in the database
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Return the users as a JSON response
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Create a new route to fetch user data by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch User Error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});



// Edit user profile route
router.put('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { username, /*email,*/age,  city, university, description } = req.body;

  try {
    // Find the user by ID and update the profile information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, /*email,*/age,  city, university, description },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user profile as a JSON response
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update User Profile Error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router,{getUserById};
