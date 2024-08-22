const mongoose = require('mongoose');
const validator = require('validator');

const wikisSchema = new mongoose.Schema({
  contentTime: {
    type: Number,
    required: true
  },
  contentBlocks: {
    type: Array,
    required: true
  },
  contentVersion: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Wikis', wikisSchema);