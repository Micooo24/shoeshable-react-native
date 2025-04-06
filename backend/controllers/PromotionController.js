const Promotion = require('../models/Promotions');
const User = require('../models/User');
const admin = require('../firebase_backend/firebaseAdmin'); // Firebase Admin SDK


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