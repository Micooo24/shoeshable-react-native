const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
    {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
      },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    deletedAt: {
        type: Date,
        default: null,
      },
    isDeleted: {
        type: Boolean,
        default: false,
      },
    }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
