const Cart = require("../models/Cart");
// const Product = require("../models/Product"); // Import the Product model

// Add an item to the cart
exports.addToCart = async (req, res) => {
    const { productId, quantity = 1, brand, category, size, color, gender } = req.body;
    const userId = req.user.id; // Fetch user ID from the authenticated request
    const userEmail = req.user.email; // Fetch user email from the authenticated request
  
    // Validate required fields
    if (!productId || !brand || !category || !size || !color || !gender) {
      return res.status(400).json({
        success: false,
        message: "Product ID, brand, category, size, color, and gender are required",
      });
    }
  
    try {
      // Check if the item already exists in the cart for the user with the same attributes
      let cartItem = await Cart.findOne({
        userId,
        productId,
        brand,
        category,
        size,
        color,
        gender,
      });
  
      if (cartItem) {
        // If item exists, increment the quantity
        cartItem.quantity += quantity;
        await cartItem.save();
        return res.status(200).json({
          success: true,
          message: "Item quantity updated in cart",
          cartItem,
          user: { id: userId, email: userEmail },
        });
      }
  
      // Create a new cart item if product doesn't exist in cart
      cartItem = new Cart({
        userId,
        productId,
        quantity,
        brand,
        category,
        size,
        color,
        gender,
      });
      await cartItem.save();
  
      // Return the cart item without populating product details
      return res.status(201).json({
        success: true,
        message: "Item added to cart",
        cartItem,
        user: { id: userId, email: userEmail },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      return res.status(500).json({ success: false, message: "Failed to add item to cart." });
    }
  };

// Fetch all items in the cart collection
// Fetch all items in the cart for the authenticated user
exports.getAllCartItems = async (req, res) => {
    const userId = req.user.id; // Fetch userId from the authenticated user
  
    try {
      // Find all cart items associated with the userId
      const cartItems = await Cart.find(
        { userId }, // Filter by userId
        "productId quantity brand category size color gender" // Select specific fields
      );
  
      if (cartItems.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No items found in cart",
          cartItems: [],
        });
      }
  
      // Return the cart items with the specified fields
      res.status(200).json({
        success: true,
        cartItems,
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching cart items",
        error: error.message,
      });
    }
  };

// // Delete an item from the cart
// exports.deleteFromCart = async (req, res) => {
//   const { productId } = req.body; // Only productId is needed in the request body
//   const userId = req.user.userId; // Use authenticated user's ID

//   try {
//     // Find the cart item and remove it based on authenticated user's ID
//     const deletedItem = await Cart.findOneAndDelete({ userId, productId });

//     if (!deletedItem) {
//       return res.status(404).json({ success: false, message: "Item not found in cart" });
//     }

//     res.status(200).json({ success: true, message: "Item deleted from cart", deletedItem });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error deleting item from cart", error });
//   }
// };


// // Fetch all items in the cart collection
// // Fetch all items in the cart for the authenticated user
// exports.getAllCartItems = async (req, res) => {
//   const userId = req.user.userId;  // Fetch userId from authenticated user

//   try {
//     // Find all cart items associated with the userId
//     const cartItems = await Cart.find({ userId })
//       .populate({
//         path: 'productId', // Select specific fields from Product
//         select: 'name description price stock image category brand', 
//         populate: [
//           {path : 'category', select: 'name'},
//           {path: 'brand', select: 'name'}
//         ]
//       });

//     if (cartItems.length === 0) {
//       return res.status(200).json({ success: true, message: "No items found in cart", cartItems: [] });
//     }

//     res.status(200).json({ success: true, cartItems });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching cart items", error: error.message });
//   }
// };


// // Update an item's quantity in the cart
// exports.updateCartItemQuantity = async (req, res) => {
//   const { productId, quantity } = req.body;
//   const userId = req.user.userId;

//   // Validate required fields
//   if (!productId || quantity === undefined) {
//     return res.status(400).json({ success: false, message: "Product ID and quantity are required" });
//   }

//   try {
//     // Find the cart item for the given user and product
//     const cartItem = await Cart.findOne({ userId, productId });

//     if (!cartItem) {
//       return res.status(404).json({ success: false, message: "Item not found in cart" });
//     }

//     // Update the item's quantity
//     cartItem.quantity = quantity;
//     await cartItem.save();

//     res.status(200).json({ success: true, message: "Item quantity updated", cartItem });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error updating item quantity", error: error.message });
//   }
// };


// // Get all cart items for a specific user
// exports.getCartByUserId = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cartItems = await Cart.find({ userId }).populate('productId');

//     // Return success with empty list if no items are found
//     return res.status(200).json({
//       success: true,
//       cartItems
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching cart items for user",
//       error: error.message
//     });
//   }
// };
