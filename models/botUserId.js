const mongoose = require('mongoose');

const BotUserId = mongoose.model(
  'BotUserId',
  new mongoose.Schema({
    chat: {
      type: String,
    },
  })
);

module.exports = BotUserId;
