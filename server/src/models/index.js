const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({ 
  country: String,
  sector: String,
  year: Number
});

const userSchema = new Schema({
  //tips on adding a user_id field that auto-increments: https://stackoverflow.com/questions/28357965/mongoose-auto-increment
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: String,
  name: {
    type: String,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    required: true
  },
  photo: String,
  services: [serviceSchema],
  description: String,
  wikisCreated: {
    type: Number,
    default: 0
  },
  wikiEdits: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const wikisSchema = new Schema({
  originalAuthorUserId: {
    type: String,
    ref: 'User',
    required: true
  },
  originalAuthorUserObjectId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  title: String,
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

const wikiHistorySchema = new Schema({
  wikiId: { 
    type: String,
    ref: 'Wikis',
    required: true
  },
  authorUserId: {
    type: String,
    ref: 'User',
    required: true
  },
  wikiObjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Wikis',
    required: true
  },
  authorUserObjectId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
}, { timestamps: true });

const communitySchema = new Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  userObjectId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  other: String
}, { timestamps: true });

const errorLogSchema = new Schema({
  userId: {
    type: String,
    ref: 'User'
  },
  userObjectId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  email: String,
  functionName: String,
  description: String
}, { timestamps: true });

exports.UserModel = mongoose.model('User', userSchema);
exports.WikisModel = mongoose.model('Wikis', wikisSchema);
exports.WikiHistoryModel = mongoose.model('WikiHistory', wikiHistorySchema);
exports.CommunityModel = mongoose.model('Community', communitySchema);
exports.ErrorLogModel = mongoose.model('ErrorLog', errorLogSchema);