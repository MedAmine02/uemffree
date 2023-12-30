const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
  city:String,
  university:String,
  description:String,
});


module.exports = mongoose.model('User', userSchema);
