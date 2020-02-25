const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NewsLetters', newsSchema);
