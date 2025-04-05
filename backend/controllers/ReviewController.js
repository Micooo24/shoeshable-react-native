const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
    try {
        // Fetch all reviews
        const reviews = await Review.find();
        
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

        // Check if the review exists
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
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
        const { productId, orderId } = req.params; // Get productId and orderId from URL params
        const { reviewText, rating } = req.body; // Get reviewText and rating from request body

        console.log('Request Body:', req.body);

        // Find the review by productId and orderId
        const review = await Review.findOne({ productId, orderId });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Update review fields if provided
        if (reviewText !== undefined) review.reviewText = reviewText;
        if (rating !== undefined) review.rating = rating;

        // Save the updated review
        const updatedReview = await review.save();
        console.log('Updated Review:', updatedReview);

        // Respond to the client
        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview,
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
        const Order = require('../models/Order'); // Import Order model
        const order = await Order.findOne({ 
            _id: orderId,
            user: userId
        });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or does not belong to you',
            });
        }
        
        // Check if the order status is delivered
        if (order.status !== 'delivered') {
            return res.status(400).json({
                success: false,
                message: 'You can only review products from delivered orders',
            });
        }
        
        // Check if the product exists in the order
        // This implementation adapts to different possible Order model structures
        let productInOrder = false;
        
        // If order.products is an array of product IDs
        if (Array.isArray(order.products) && order.products.length > 0) {
            if (typeof order.products[0] === 'string' || order.products[0] instanceof mongoose.Types.ObjectId) {
                productInOrder = order.products.some(product => 
                    product.toString() === productId.toString()
                );
            } 
            // If order.products is an array of objects with a product field
            else if (typeof order.products[0] === 'object' && order.products[0].product) {
                productInOrder = order.products.some(item => 
                    item.product.toString() === productId.toString()
                );
            }
            // If order has a different structure with product IDs
            else if (order.items && Array.isArray(order.items)) {
                productInOrder = order.items.some(item => 
                    (item.product || item.productId).toString() === productId.toString()
                );
            }
        }
        
        if (!productInOrder) {
            return res.status(400).json({
                success: false,
                message: 'You can only review products that you ordered',
            });
        }
        
        // Check if the user has already reviewed this product from this order
        const existingReview = await Review.findOne({
            productId,
            orderId,
            user: userId
        });
        
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product from this order',
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
        
        // Return the created review
        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: review
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