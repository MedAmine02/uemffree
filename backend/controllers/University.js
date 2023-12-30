const express = require('express');
const router = express.Router();
const University = require('../models/University'); // Replace with your university model

// Add a new university
router.post('/add', async (req, res) => {
  try {
    const { name, fullName,description,  city, country,rating, logo,image } = req.body;

    const university = new University({
      name,
      fullName,
      description,
      city,
      country,
      rating,
      logo,
      image,
    });

    await university.save();
    res.status(201).json({ message: 'University added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
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




// Remove a university by ID
router.delete('/remove/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await University.findByIdAndRemove(id);
    res.status(200).json({ message: 'University removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
