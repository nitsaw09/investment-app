const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Add index for faster queries
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: true,
    index: true // Add index for faster queries
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for frequently accessed fields
userSchema.index({ email: 1, name: 1 });

// Optimize password hashing using middleware
userSchema.pre('updateOne', async function(next) {
  if (this._update && this._update.$set && this._update.$set.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this._update.$set.password = await bcrypt.hash(this._update.$set.password, salt);
      next();
    } catch (error) {
      next(new Error(`Error hashing password: ${error.message}`));
    }
  } else {
    next();
  }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add TTL index for automatic document expiration if needed
// userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30 days

const User = mongoose.model('User', userSchema);

// Create indexes
User.createIndexes().catch(console.error);

module.exports = User;