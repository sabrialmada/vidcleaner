const mongoose = require('mongoose');

const EMAIL_STATUS = {
    PENDING: 'pending',
    SENT: 'sent',
    FAILED: 'failed'
};

const emailLogSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(EMAIL_STATUS),
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  messageId: String,
  error: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmailLog', emailLogSchema);