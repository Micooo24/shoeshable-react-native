const Promotion = require('../models/Promotions');
const User = require('../models/User');
const admin = require('../firebase_backend/firebaseAdmin'); // Firebase Admin SDK

// Create a new promotion
exports.createPromotion = async (req, res) => {
  try {
    const { product, title, description, discountPercentage, startDate, endDate, imageUrl } = req.body;

    // Validate required fields
    if (!product || !title || !description || !discountPercentage || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Create the promotion
    const promotion = await Promotion.create({
      product,
      title,
      description,
      discountPercentage,
      startDate,
      endDate,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      promotion,
    });
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create promotion',
      error: error.message,
    });
  }
};

// Get all promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate('product', 'name price category brand');
    res.status(200).json({
      success: true,
      promotions,
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotions',
      error: error.message,
    });
  }
};

// Get a single promotion by ID
exports.getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id).populate('product', 'name price category brand');
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
    }

    res.status(200).json({
      success: true,
      promotion,
    });
  } catch (error) {
    console.error('Error fetching promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotion',
      error: error.message,
    });
  }
};

// Update a promotion
exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, discountPercentage, startDate, endDate, imageUrl } = req.body;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
    }

    // Update fields
    if (title) promotion.title = title;
    if (description) promotion.description = description;
    if (discountPercentage) promotion.discountPercentage = discountPercentage;
    if (startDate) promotion.startDate = startDate;
    if (endDate) promotion.endDate = endDate;
    if (imageUrl) promotion.imageUrl = imageUrl;

    await promotion.save();

    res.status(200).json({
      success: true,
      message: 'Promotion updated successfully',
      promotion,
    });
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update promotion',
      error: error.message,
    });
  }
};

// Delete a promotion
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
    }

    await promotion.remove();

    res.status(200).json({
      success: true,
      message: 'Promotion deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete promotion',
      error: error.message,
    });
  }
};

// Send notifications for selected promotions
exports.sendSelectedPromotionNotifications = async (req, res) => {
  try {
    const { promotionIds } = req.body;

    // Fetch the selected promotions
    const promotions = await Promotion.find({ _id: { $in: promotionIds } }).populate('product', 'name');
    if (promotions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No promotions found for the given IDs',
      });
    }

    // Fetch all users with FCM tokens
    const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users with FCM tokens found',
      });
    }

    // Prepare and send notifications for each promotion
    const tokens = users.map((user) => user.fcmToken);
    const responses = [];

    for (const promotion of promotions) {
      const notificationPayload = {
        notification: {
          title: promotion.title,
          body: `${promotion.product.name} is now ${promotion.discountPercentage}% off!`,
        },
        data: {
          promotionId: promotion._id.toString(),
          productId: promotion.product._id.toString(),
          screen: 'PromotionDetails', // Navigate to a specific screen in the app
        },
      };

      const response = await admin.messaging().sendMulticast({
        tokens,
        ...notificationPayload,
      });

      responses.push({
        promotionId: promotion._id,
        successCount: response.successCount,
        failureCount: response.failureCount,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notifications sent for selected promotions',
      results: responses,
    });
  } catch (error) {
    console.error('Error sending promotion notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send promotion notifications',
      error: error.message,
    });
  }
};

// Get a specific promotion by ID or title
exports.getPromotionByIdOrTitle = async (req, res) => {
    try {
      const { id, title } = req.query;
  
      let promotion;
      if (id) {
        // Find promotion by ID
        promotion = await Promotion.findById(id).populate('product', 'name price category brand');
      } else if (title) {
        // Find promotion by title
        promotion = await Promotion.findOne({ title }).populate('product', 'name price category brand');
      }
  
      if (!promotion) {
        return res.status(404).json({
          success: false,
          message: 'Promotion not found',
        });
      }
  
      res.status(200).json({
        success: true,
        promotion,
      });
    } catch (error) {
      console.error('Error fetching promotion:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch promotion',
        error: error.message,
      });
    }
  };