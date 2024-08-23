const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  /*tips on adding a user_id field that auto-increments: https://stackoverflow.com/questions/28357965/mongoose-auto-increment*/
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String
  },
  google_id: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);