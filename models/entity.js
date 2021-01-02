const mongoose = require('mongoose');

const Entity = mongoose.model(
  'Entity',
  new mongoose.Schema({
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    platforms: {
      type: String,
    },
    clientId: {
      type: String,
      default: null,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    manualSendingConfirmation: {
      type: Boolean,
      default: false,
    },
    didConfirmSending: {
      type: Boolean,
      default: false,
    },
    didConfirmSendingByRecipient: {
      type: Boolean,
      default: false,
    },
    sendingConfirmationText: {
      type: String,
      default: null,
    },
    didConfirmGetting: {
      type: Boolean,
      default: false,
    },
    didReportSanta: {
      type: Boolean,
      default: false,
    },
    isReportedByRecipient: {
      type: Boolean,
      default: false,
    },
  })
);

module.exports = Entity;
