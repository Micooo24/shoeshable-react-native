// const Wishlist = require('../models/Wishlist');
// const mongoose = require('mongoose');

// exports.addToWishlist = async (req, res) => {
//   const { userId, productId } = req.body;

//   try {
//     // Check if the product is already in the wishlist
//     const existingWishlist = await Wishlist.findOne({ userId, productId });
//     if (existingWishlist) {
//       return res.status(400).json({ message: 'Product already in wishlist' });
//     }

//     // Create a new wishlist item
//     const newWishlistItem = new Wishlist({ userId, productId });
//     await newWishlistItem.save();

//     res.status(201).json(newWishlistItem);
//   } catch (error) {
//     console.error('Error adding to wishlist:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.getWishlist = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Fetch the wishlist for the user
//     const wishlist = await Wishlist.find({ userId }).populate('productId');
//     res.status(200).json(wishlist);
//   } catch (error) {
//     console.error('Error fetching wishlist:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.removeFromWishlist = async (req, res) => {
//   const { userId, productId } = req.params;

//   try {
//     // Remove the product from the wishlist
//     const result = await Wishlist.findOneAndDelete({ userId, productId });
//     if (!result) {
//       return res.status(404).json({ message: 'Product not found in wishlist' });
//     }

//     res.status(200).json({ message: 'Product removed from wishlist' });
//   } catch (error) {
//     console.error('Error removing from wishlist:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.clearWishlist = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Clear the wishlist for the user
//     await Wishlist.deleteMany({ userId });
//     res.status(200).json({ message: 'Wishlist cleared' });
//   } catch (error) {
//     console.error('Error clearing wishlist:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };