const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  /*tips on adding a user_id field that auto-increments: https://stackoverflow.com/questions/28357965/mongoose-auto-increment*/
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value);
    }
  },
  password: {
    type: String,
    validate: (value) => {
      return validator.isLength(value, { min: 6, max: 15});
    }
  },
  google_id: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);