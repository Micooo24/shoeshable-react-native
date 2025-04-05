const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendPushNotification } = require('../firebase_backend/firebaseAdmin');
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
};

// Admin: Update order status
exports.updateOrder = async (req, res) => {
    try {
        console.log('----------- UPDATE ORDER DEBUG -----------');
        console.log('Request Body:', req.body);
        console.log('Order ID:', req.params.id);
        console.log('Expected status field name: "status"');
        console.log('Available status values:', ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']);
        
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

        // Check if status is sent with the correct field name
        const newStatus = req.body.status || req.body.orderStatus;
        console.log('New status to be applied:', newStatus);
        
        if (!newStatus) {
            console.log('ERROR: No status provided in request body');
            return res.status(400).json({
                success: false,
                message: 'No status provided'
            });
        }
        
        // Validate if the status is valid
        const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(newStatus)) {
            console.log('ERROR: Invalid status value provided:', newStatus);
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        // Apply the new status
        order.orderStatus = newStatus;
        
        if (newStatus === 'Delivered') {
            console.log('Marking order as delivered, setting deliveredAt timestamp');
            order.deliveredAt = Date.now();

            // If it was COD, mark as paid when delivered
            if (!order.paidAt && order.paymentInfo.method === 'Cash on Delivery') {
                console.log('COD order being delivered - marking as paid');
                order.paidAt = Date.now();
            }
        }

        await order.save();
        console.log('Order successfully updated to status:', newStatus);

        // Send push notification to the user
        try {
            // Get the user associated with this order
            const user = await User.findById(order.user);
            
            if (user && user.fcmToken) {
                console.log('Sending push notification to user:', user._id);
                console.log('FCM Token:', user.fcmToken);
                
                // Create notification message based on order status
                let title = 'Order Update';
                let body = '';
                
                switch(newStatus) {
                    case 'Processing':
                        body = `Your order #${order._id.toString().slice(-6)} is now being processed.`;
                        break;
                    case 'Confirmed':
                        body = `Your order #${order._id.toString().slice(-6)} has been confirmed.`;
                        break;
                    case 'Shipped':
                        body = `Good news! Your order #${order._id.toString().slice(-6)} has been shipped.`;
                        break;
                    case 'Delivered':
                        body = `Your order #${order._id.toString().slice(-6)} has been delivered. Thank you for shopping with us!`;
                        break;
                    case 'Cancelled':
                        body = `Your order #${order._id.toString().slice(-6)} has been cancelled.`;
                        break;
                    default:
                        body = `Your order #${order._id.toString().slice(-6)} status has been updated to ${newStatus}.`;
                }
                
                // Send the notification
                await sendPushNotification(
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
            // Log the error but don't fail the order update
            console.error('Error sending push notification:', notificationError);
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