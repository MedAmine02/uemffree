const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName:{ type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  rating: { type: Number, required: true },
  logo: { type: String, required: true }, // Assuming the logo will be stored as a URL or file path
  image: { type: String }, // Assuming the image will be stored as a URL or file path
});

const University = mongoose.model('University', universitySchema);

module.exports = University;
