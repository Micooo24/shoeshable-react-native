// Import the Review model
const Review = require('../models/Reviews');

/**
 * Fetch all reviews from the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getAllReviews = async (req, res) => {
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

/**
 * Delete a review from the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const deleteReview = async (req, res) => {
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

/**
 * Update a review in the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const updateReview = async (req, res) => {
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



// Export all functions
module.exports = { getAllReviews, deleteReview, updateReview };