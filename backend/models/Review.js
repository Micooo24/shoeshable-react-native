const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', 
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', 
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
