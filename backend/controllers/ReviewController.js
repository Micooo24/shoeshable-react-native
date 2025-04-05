const Review = require('../models/Review');
const Order = require('../models/Order');
const mongoose = require('mongoose');

exports.getAllReviews = async (req, res) => {
    try {
        // Fetch all reviews with populated user data
        const reviews = await Review.find()
            .populate({
                path: 'user',
                select: 'firstName lastName profileImage'
            });
        
        // Send the reviews as a response
        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Fetch reviews for a specific product with populated user data
        const reviews = await Review.find({ productId })
            .populate({
                path: 'user',
                select: 'firstName lastName profileImage'
            });
        
        // Send the reviews as a response
        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        // Get the review ID from the request parameters
        const { id } = req.params;
        const userId = req.user._id; // Get current user ID

        // Check if the review exists
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if the review belongs to the current user
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this review',
            });
        }

        // Delete the review
        await Review.findByIdAndDelete(id);

        // Send a success response
        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message,
        });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params; // Get review ID from URL params
        const { reviewText, rating } = req.body; // Get reviewText and rating from request body

        console.log('Request Body:', req.body);

        // Find the review by ID
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if the review belongs to the current user
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this review',
            });
        }

        // Update review fields if provided
        if (reviewText !== undefined) review.reviewText = reviewText;
        if (rating !== undefined) review.rating = rating;

        // Save the updated review
        const updatedReview = await review.save();
        console.log('Updated Review:', updatedReview);

        // Respond to the client with populated user data
        const populatedReview = await Review.findById(updatedReview._id).populate({
            path: 'user',
            select: 'firstName lastName profileImage'
        });

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: populatedReview
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: error.message,
        });
    }
};

exports.createReview = async (req, res) => {
    try {
        // Get data from request
        const { productId, orderId, reviewText, rating } = req.body;
        const userId = req.user._id; // Assuming user is attached to req by authentication middleware
        
        console.log('Received review data:', { productId, orderId, reviewText, rating, userId });
        
        // Check if all required fields are provided
        if (!productId || !orderId || !reviewText || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Please provide productId, orderId, reviewText, and rating',
            });
        }
        
        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }
        
        // Find the order and check if it belongs to the user
        const order = await Order.findOne({ 
            _id: orderId,
            user: userId
        });
        
        console.log('Found order:', order ? order._id : 'None');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or does not belong to you',
            });
        }
        
        // Check if the order status is delivered - using the correct field name and value
        if (order.orderStatus !== 'Delivered') {
            return res.status(400).json({
                success: false,
                message: 'You can only review products from delivered orders',
            });
        }
        
        // Check if the product exists in the order using orderItems array
        let productInOrder = false;
        
        if (order.orderItems && Array.isArray(order.orderItems)) {
            productInOrder = order.orderItems.some(item => 
                item.productId.toString() === productId.toString()
            );
        }
        
        if (!productInOrder) {
            return res.status(400).json({
                success: false,
                message: 'You can only review products that you ordered',
            });
        }
        // Create the review
        const review = await Review.create({
            productId,
            orderId,
            reviewText,
            rating,
            user: userId
        });
        
        // Return the created review with populated user data
        const populatedReview = await Review.findById(review._id).populate({
            path: 'user',
            select: 'firstName lastName profileImage'
        });
        
        // Return the created review
        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: populatedReview
        });
        
    } catch (error) {
        console.error('Error creating review:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: error.message,
        });
    }
};