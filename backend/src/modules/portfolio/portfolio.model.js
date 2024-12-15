const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User ', 
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  tokenBalances: [
    {
      name: {
        type: String,
        required: true,
      },
      network: {
        type: String,
        required: true,
      },
      symbol: {
        type: String,
        required: true,
      },
      tokenBalance: {
        type: Number,
        required: true
      },
      balanceUSD: {
        type: Number,
        required: true
      },
      nativeToken: {
        type: Boolean,
        required: true
      },
      imgUrl: {
        type: String
      }
    },
  ],
}, {
  timestamps: true,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;