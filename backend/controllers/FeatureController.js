const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getTrendingProducts = async (req, res) => {
    try {
        // Get parameters from query
        const limit = parseInt(req.query.limit) || 10;
        const period = req.query.period || 'all'; // all, week, month, year
        const sortBy = req.query.sortBy || 'quantity'; // quantity, revenue
        
        let match = {};
        
        // Add time period filter
        const now = new Date();
        if (period === 'week') {
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            match.createdAt = { $gte: lastWeek };
        } else if (period === 'month') {
            const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            match.createdAt = { $gte: lastMonth };
        } else if (period === 'year') {
            const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            match.createdAt = { $gte: lastYear };
        }
        
        const pipeline = [
            { $match: match },
            
            // Deconstruct orderItems array
            { $unwind: '$orderItems' },
            
            // Group by product to calculate metrics
            {
                $group: {
                    _id: '$orderItems.productId',
                    totalSold: { $sum: '$orderItems.quantity' },
                    revenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.productPrice'] } },
                    productName: { $first: '$orderItems.productName' },
                    productImage: { $first: '$orderItems.productImage' },
                    sizes: { $addToSet: '$orderItems.size' },
                    colors: { $addToSet: '$orderItems.color' },
                    averagePrice: { $avg: '$orderItems.productPrice' }
                }
            },
            
            // Sort by either quantity sold or revenue
            { $sort: { [sortBy === 'revenue' ? 'revenue' : 'totalSold']: -1 } },
            
            // Limit the number of results
            { $limit: limit }
        ];
        
        // Execute the aggregation
        const trendingProducts = await Order.aggregate(pipeline);
        
        // If you want to include any additional product information, fetch it
        if (trendingProducts.length > 0) {
            const productIds = trendingProducts.map(item => item._id);
            const productDetails = await Product.find({ _id: { $in: productIds } })
                .select('name description category brand inStock ratings'); // Select needed fields
            
            // Create a map for quick lookups
            const productMap = {};
            productDetails.forEach(product => {
                productMap[product._id] = product;
            });
            
            // Add additional product details to each trending product
            trendingProducts.forEach(item => {
                if (productMap[item._id]) {
                    // Include any additional product details you want to show
                    item.category = productMap[item._id].category;
                    item.brand = productMap[item._id].brand;
                    item.inStock = productMap[item._id].inStock;
                    item.ratings = productMap[item._id].ratings;
                    item.description = productMap[item._id].description;
                }
            });
        }
        
        res.status(200).json({
            success: true,
            period,
            sortBy,
            count: trendingProducts.length,
            trendingProducts
        });
    } catch (error) {
        console.error('Error getting trending products:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};