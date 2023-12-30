const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const University = require('../models/University');

// Add a route to search universities by name
router.get('/search', async (req, res) => {
    try {
      const { keyword } = req.query;
  
      const universities = await University.find({
        name: { $regex: keyword, $options: 'i' }, // Case-insensitive search
      });
  
      res.status(200).json({ universities });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

  // Route to fetch university data
  router.get('/university-data', async (req, res) => {
    try {
      const universities = await University.find({}, 'name fullName description city country rating logo image isBookmarked'); // Replace with the fields you want to fetch
      res.status(200).json({ universities });
    } catch (error) {
      console.error(error); // Log the error to see what's going wrong
      res.status(500).json({ message: 'Failed to fetch university data', error });
    }
  });


  // Add a route to get university names and images
router.get('/imguniv', async (req, res) => {
  try {
    const universities = await University.find({}, 'name image'); // Retrieve only name and image fields
    res.status(200).json({ universities });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

  

module.exports = router;