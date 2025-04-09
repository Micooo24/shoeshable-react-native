const Order = require('../models/Order');
const Product = require('../models/Product');
const admin = require('../firebase_backend/firebaseAdmin'); 
const User = require('../models/User'); 
// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { 
            shippingInfo, 
            orderItems, 
            paymentInfo, 
            voucher,
            subtotal,
            shippingFee,
            discountAmount,
            totalPrice
        } = req.body;

        // Using userId from the auth middleware
        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            voucher: voucher || {}, // Handle if voucher is not provided
            subtotal,
            shippingFee: shippingFee || 100, // Default to 100 if not provided
            discountAmount: discountAmount || 0, // Default to 0 if not provided
            totalPrice,
            paidAt: paymentInfo.method === 'Cash on Delivery' ? null : Date.now(),
            user: req.userId // Using req.userId from your middleware
        });

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Order creation failed',
            error: error.message
        });
    }
};

// Get single order by ID
exports.getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'orderItems.productId',
                select: 'name category brand'
            });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get logged in user orders
exports.myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .sort({ createdAt: -1 }); // Latest orders first

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 }); // Latest orders first

        let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            totalAmount,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


//FCM Notification function
const sendFCMNotification = async (fcmToken, title, body, data = {}) => {
    try {
      console.log(`Sending notification to token: ${fcmToken}`);
      
      const message = {
        token: fcmToken,  
        notification: {
          title,
          body,
        },
        data: typeof data === 'object' ? 
          Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, String(value)])
          ) : {},
        android: {
          priority: 'high',
          notification: {
            // Change this to match the channel created in App.js
            channelId: 'shoeshable-orders', // UPDATED
            priority: 'high',
            visibility: 'public',
            sound: 'default',
            defaultSound: true,
            // Add color for notification icon
            color: '#1976D2'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              contentAvailable: true
            }
          },
          headers: {
            'apns-priority': '10',
          }
        }
      };
      
      const response = await admin.messaging().send(message);
      console.log(`Successfully sent notification: ${response}`);
      return response;
      
    } catch (error) {
      console.error('Error sending FCM notification:', error);
      throw error;
    }
  };

// Admin: Update order status
exports.updateOrder = async (req, res) => {
    try {
        // console.log('Request Body:', req.body);
        // console.log('Order ID:', req.params.id);
        
        const order = await Order.findById(req.params.id);

        if (!order) {
            console.log('Order not found with ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log('Current order status:', order.orderStatus);

        if (order.orderStatus === 'Delivered') {
            console.log('Cannot update: Order already delivered');
            return res.status(400).json({
                success: false,
                message: 'You have already delivered this order'
            });
        }

        if (order.orderStatus === 'Cancelled') {
            console.log('Cannot update: Order already cancelled');
            return res.status(400).json({
                success: false,
                message: 'This order has already been cancelled'
            });
        }

        const newStatus = req.body.status || req.body.orderStatus;
        console.log('New status to be applied:', newStatus);
        
        if (!newStatus) {
            console.log('ERROR: No status provided in request body');
            return res.status(400).json({
                success: false,
                message: 'No status provided'
            });
        }
        
        const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(newStatus)) {
            console.log('ERROR: Invalid status value provided:', newStatus);
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        order.orderStatus = newStatus;
        
        if (newStatus === 'Delivered') {
            console.log('Marking order as delivered, setting deliveredAt timestamp');
            order.deliveredAt = Date.now();

            if (!order.paidAt && order.paymentInfo.method === 'Cash on Delivery') {
                console.log('COD order being delivered - marking as paid');
                order.paidAt = Date.now();
            }
        }

        await order.save();
        console.log('Order successfully updated to status:', newStatus);

        if (req.body.sendNotification) {
            try {
                // Get the user associated with this order
                const user = await User.findById(order.user);
                
                if (user && user.fcmToken) {
                    console.log('Sending push notification to user:', user._id);
                    console.log('FCM Token:', user.fcmToken);
                    
                    // Create personalized notification message based on order status
                    let title = 'Order Update';
                    let body = '';
                    
                    const orderIdShort = order._id.toString().slice(-6);
                    const customerName = user.name || 'Customer';
                    
                    switch(newStatus) {
                        case 'Processing':
                            title = 'Order Processing';
                            body = `Dear ${customerName}, your order #${orderIdShort} is now being processed.`;
                            break;
                        case 'Confirmed':
                            title = 'Order Confirmed';
                            body = `Dear ${customerName}, your order #${orderIdShort} has been confirmed.`;
                            break;
                        case 'Shipped':
                            title = 'Order Shipped';
                            body = `Good news! Your order #${orderIdShort} has been shipped and is on its way.`;
                            break;
                        case 'Delivered':
                            title = 'Order Delivered';
                            body = `Your order #${orderIdShort} has been delivered. Thank you for shopping with us!`;
                            break;
                        case 'Cancelled':
                            title = 'Order Cancelled';
                            body = `Your order #${orderIdShort} has been cancelled.`;
                            break;
                        default:
                            body = `Your order #${orderIdShort} status has been updated to ${newStatus}.`;
                    }
                    
                    await sendFCMNotification(
                        user.fcmToken, 
                        title, 
                        body,
                        {
                            orderId: order._id.toString(),
                            orderStatus: newStatus,
                            screen: 'OrderDetail'
                        }
                    );
                    console.log('Push notification sent successfully');
                } else {
                    console.log('No FCM token available for user or user not found');
                }
            } catch (notificationError) {
                console.error('Error sending push notification:', notificationError);

                return res.status(200).json({
                    success: true,
                    message: 'Order status updated but notification failed',
                    notificationError: true,
                    order
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Fetch all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.userId; 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

        const notifications = orders.map(order => {
            const orderIdShort = order._id.toString().slice(-6);
            let title = 'Order Update';
            let body = '';
            let screen = 'OrderDetail';

            switch (order.orderStatus) {
                case 'Processing':
                    title = 'Order Processing';
                    body = `Your order #${orderIdShort} is now being processed.`;
                    break;
                case 'Confirmed':
                    title = 'Order Confirmed';
                    body = `Your order #${orderIdShort} has been confirmed.`;
                    break;
                case 'Shipped':
                    title = 'Order Shipped';
                    body = `Good news! Your order #${orderIdShort} has been shipped.`;
                    break;
                case 'Delivered':
                    title = 'Order Delivered';
                    body = `Your order #${orderIdShort} has been delivered.`;
                    break;
                case 'Cancelled':
                    title = 'Order Cancelled';
                    body = `Your order #${orderIdShort} has been cancelled.`;
                    break;
                default:
                    body = `Your order #${orderIdShort} status is ${order.orderStatus}.`;
            }

            return {
                orderId: order._id,
                title,
                body,
                orderStatus: order.orderStatus,
                timestamp: order.updatedAt || order.createdAt,
                screen,
            };
        });

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message,
        });
    }
};



exports.cancelOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            console.log('Order not found with ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const userIdFromBody = req.body.userId;
        const isAuthorized = 
            order.user.toString() === req.userId || 
            (userIdFromBody && order.user.toString() === userIdFromBody);
        
        if (!isAuthorized) {
            // console.log('Unauthorized cancellation attempt');
            // console.log('Authenticated user ID:', req.userId);
            // console.log('User ID from request body:', userIdFromBody);
            // console.log('Order user ID (string):', order.user.toString());
            return res.status(403).json({
                success: false,
                message: 'You can only cancel your own orders'
            });
        }

        // Users can only cancel orders in specific statuses
        const cancellableStatuses = ['Processing', 'Confirmed'];
        if (!cancellableStatuses.includes(order.orderStatus)) {
            console.log(`Order in ${order.orderStatus} status cannot be cancelled by user`);
            return res.status(400).json({
                success: false,
                message: `Orders in ${order.orderStatus} status cannot be cancelled. Please contact customer service.`
            });
        }

        const cancellationReason = req.body.reason || 'Cancelled by customer';
        console.log('Cancellation reason:', cancellationReason);

        // Cancel
        order.orderStatus = 'Cancelled';
        order.cancellationReason = cancellationReason;
        order.cancelledAt = Date.now();
        
        await order.save();
        console.log('Order successfully cancelled by user');

    
        try {
            const orderId = order._id.toString();
            const userId = order.user.toString();
            const user = await User.findById(userId);
            
            if (user && user.fcmToken) {
                console.log('Sending cancellation confirmation to user:', userId);
                console.log('FCM Token:', user.fcmToken);
                
                const orderIdShort = orderId.slice(-6);
                const title = 'Order Cancellation Confirmed';
                const body = `Your order #${orderIdShort} has been successfully cancelled.`;
                
                await sendFCMNotification(
                    user.fcmToken, 
                    title, 
                    body,
                    {
                        orderId: orderId,
                        userId: userId,
                        orderStatus: 'Cancelled',
                        screen: 'OrderDetail'
                    }
                );
                console.log('Cancellation confirmation sent');
            } else {
                console.log('No FCM token available or user not found for notification');
            }
        } catch (notificationError) {
            console.error('Error sending cancellation confirmation:', notificationError);
            console.error('Notification error details:', notificationError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Your order has been cancelled successfully',
            order
        });
    } catch (error) {
        console.error('Error in user order cancellation:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong while cancelling your order',
            error: error.message
        });
    }
};