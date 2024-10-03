/* const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['inactive', 'active', 'pending', 'cancelled'],
    default: 'inactive'
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  lastFourDigits: {
    type: String,
    default: null
  },
  cardExpiry: {
    type: String,
    default: null
  },
  subscriptionPlan: {
    type: String,
    default: 'Monthly'
  },
  subscriptionAmount: {
    type: Number,
    default: 49.00
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema); */

// FOR PRODUCTION

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['inactive', 'active', 'pending', 'cancelled'],
    default: 'inactive'
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  lastFourDigits: {
    type: String,
    default: null
  },
  cardExpiry: {
    type: String,
    default: null
  },
  subscriptionPlan: {
    type: String,
    default: 'Monthly'
  },
  subscriptionAmount: {
    type: Number,
    default: 49.00
  }
}, {
  timestamps: true
});

// Index for faster queries
UserSchema.index({ email: 1, stripeCustomerId: 1 });

// Pre-save hook to hash password
/* UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
}); */

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to get user information without sensitive data
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.stripeCustomerId;
  delete userObject.stripeSubscriptionId;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);