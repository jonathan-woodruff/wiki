const mongoose = require('mongoose');

const wikiHistorySchema = new mongoose.Schema({
  wikiId: {
    type: String,
    required: true
  },
  authorUserId: {
    type: String,
    required: true
  },
  changeDescription: {
    type: String,
    required: true
  },
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
});

module.exports = mongoose.model('WikiHistory', wikiHistorySchema);