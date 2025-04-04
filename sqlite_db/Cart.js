import { getDatabase } from './Database';

/**
 * Add a product to the cart or update quantity if already exists
 * @param {string} userId - User ID
 * @param {object} cartItem - Cart item object with product details
 * @returns {Promise<object>} - The added/updated cart item
 */
export const addCartItemToDatabase = async (userId, cartItem) => {
  try {
    const db = await getDatabase();
    const now = new Date().toISOString();

    // Validate required fields
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!cartItem.productId) {
      throw new Error('Product ID is required');
    }

    console.log('Cart Item before INSERT:', cartItem);

    // Check if product already exists in cart WITH SAME SIZE AND COLOR
    const [checkResult] = await db.executeSql(
      `SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?`, 
      [userId, cartItem.productId, cartItem.size, cartItem.color]
    );

    // If product exists with same size and color, update quantity
    if (checkResult.rows.length > 0) {
      const existingItem = checkResult.rows.item(0);
      const newQuantity = existingItem.quantity + (cartItem.quantity || 1);

      // Update quantity and updatedAt
      await db.executeSql(
        `UPDATE cart SET quantity = ?, updatedAt = ? WHERE id = ?`,
        [newQuantity, now, existingItem.id]
      );

      // Return updated item
      const [updated] = await db.executeSql(
        `SELECT * FROM cart WHERE id = ?`,
        [existingItem.id]
      );

      return updated.rows.item(0);
    } else {
      // Add new item to cart
      const params = [
        userId,
        cartItem.productId,
        cartItem.quantity || 1,
        cartItem.brand || null,
        cartItem.category || null,
        cartItem.size || null,
        cartItem.color || null,
        cartItem.gender || null,
        cartItem.productImage || null,
        cartItem.productName || null,
        cartItem.productPrice || null,
        now,
        now
      ];

      console.log('Params for INSERT:', params);

      const [result] = await db.executeSql(
        `INSERT INTO cart (
          user_id, 
          product_id, 
          quantity, 
          brand, 
          category, 
          size, 
          color, 
          gender, 
          productImage,
          productName,
          productPrice,
          createdAt, 
          updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      // Get the inserted item
      const insertId = result.insertId;
      const [inserted] = await db.executeSql(
        `SELECT * FROM cart WHERE id = ?`,
        [insertId]
      );

      return inserted.rows.item(0);
    }
  } catch (error) {
    console.error('Error adding item to cart in database:', error);
    throw error;
  }
};

/**
 * Get all cart items for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of cart items
 */
export const getCartItemsFromDatabase = async (userId) => {
  try {
    if (!userId) {
      console.error('No user ID provided to getCartItemsFromDatabase');
      return [];
    }

    const db = await getDatabase();

    console.log(`Fetching cart items for user: ${userId}`);

    const [results] = await db.executeSql(
      `SELECT * FROM cart WHERE user_id = ? ORDER BY updatedAt DESC`,
      [userId]
    );

    const items = [];
    for (let i = 0; i < results.rows.length; i++) {
      const item = results.rows.item(i);
      // Verify the user_id to ensure we're only getting the current user's items
      if (item.user_id === userId) {
        items.push(item);
      } else {
        console.warn(`Found cart item with mismatched user ID. Expected: ${userId}, Got: ${item.user_id}`);
      }
    }

    console.log(`Found ${items.length} cart items for user ${userId}`);

    return items;
  } catch (error) {
    console.error('Error getting cart items from database:', error);
    throw error;
  }
};

/**
 * Update cart item fields (size, color, etc)
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} - The updated cart item
 */
export const updateCartItemInDatabase = async (userId, productId, updates) => {
  try {
    const db = await getDatabase();
    const now = new Date().toISOString();
    
    // Find the cart item
    const [findResult] = await db.executeSql(
      `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );
    
    if (findResult.rows.length === 0) {
      throw new Error(`Cart item not found for product: ${productId}`);
    }
    
    const item = findResult.rows.item(0);
    
    // Check for uniqueness constraint if updating size or color
    if (updates.size !== undefined || updates.color !== undefined) {
      // Determine the new size and color values (use existing if not being updated)
      const newSize = updates.size !== undefined ? updates.size : item.size;
      const newColor = updates.color !== undefined ? updates.color : item.color;
      
      // Check if another item exists with the same product and new size/color
      const [checkResult] = await db.executeSql(
        `SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ? AND color = ? AND id != ?`,
        [userId, productId, newSize, newColor, item.id]
      );
      
      // If a duplicate would be created, handle it
      if (checkResult.rows.length > 0) {
        console.log('Found duplicate item when trying to update size/color. Will merge quantities.');
        
        const duplicateItem = checkResult.rows.item(0);
        
        // Merge quantities into the existing item
        const newQuantity = duplicateItem.quantity + item.quantity;
        
        // Update the quantity on the duplicate item
        await db.executeSql(
          `UPDATE cart SET quantity = ?, updatedAt = ? WHERE id = ?`,
          [newQuantity, now, duplicateItem.id]
        );
        
        // Delete the original item since it's now merged
        await db.executeSql(
          `DELETE FROM cart WHERE id = ?`,
          [item.id]
        );
        
        // Return the merged item
        const [merged] = await db.executeSql(
          `SELECT * FROM cart WHERE id = ?`,
          [duplicateItem.id]
        );
        
        return merged.rows.item(0);
      }
    }
    
    // Build dynamic update query based on provided fields ONLY
    const updateFields = [];
    const values = [];
    
    // Only update fields that were explicitly provided
    Object.keys(updates).forEach(field => {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    });
    
    // If no fields to update, just return the current item
    if (updateFields.length === 0) {
      return item;
    }
    
    // Add updatedAt
    updateFields.push('updatedAt = ?');
    values.push(now);
    
    // Add where clause parameter
    values.push(item.id);
    
    console.log(`Updating cart item ${item.id} with fields: ${updateFields.join(', ')}`);
    console.log('Update values:', values);
    
    // Execute update
    await db.executeSql(
      `UPDATE cart SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    // Get updated item
    const [updated] = await db.executeSql(
      `SELECT * FROM cart WHERE id = ?`,
      [item.id]
    );
    
    const updatedItem = updated.rows.item(0);
    console.log('Updated item:', updatedItem);
    
    return updatedItem;
  } catch (error) {
    console.error('Error updating cart item in database:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise<object>} - The updated cart item
 */
export const updateCartItemQuantityInDatabase = async (userId, productId, quantity) => {
  try {
    const db = await getDatabase();
    const now = new Date().toISOString();
    
    // Find the cart item
    const [findResult] = await db.executeSql(
      `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );
    
    if (findResult.rows.length === 0) {
      throw new Error(`Cart item not found for product: ${productId}`);
    }
    
    const item = findResult.rows.item(0);
    
    // Update quantity specifically
    await db.executeSql(
      `UPDATE cart SET quantity = ?, updatedAt = ? WHERE id = ?`,
      [quantity, now, item.id]
    );
    
    // Get updated item
    const [updated] = await db.executeSql(
      `SELECT * FROM cart WHERE id = ?`,
      [item.id]
    );
    
    return updated.rows.item(0);
  } catch (error) {
    console.error('Error updating cart item quantity in database:', error);
    throw error;
  }
};

/**
 * Remove an item from the cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to remove
 * @returns {Promise<boolean>} - True if successful
 */
export const removeCartItemFromDatabase = async (userId, productId) => {
  try {
    const db = await getDatabase();
    
    await db.executeSql(
      `DELETE FROM cart WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );
    
    return true;
  } catch (error) {
    console.error('Error removing cart item from database:', error);
    throw error;
  }
};

/**
 * Clear all items from the cart
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - True if successful
 */
export const clearCartFromDatabase = async (userId) => {
  try {
    const db = await getDatabase();
    
    await db.executeSql(
      `DELETE FROM cart WHERE user_id = ?`,
      [userId]
    );
    
    return true;
  } catch (error) {
    console.error('Error clearing cart from database:', error);
    throw error;
  }
};


/**
 * Remove multiple items from the cart by their product IDs
 * @param {string} userId - User ID
 * @param {array} productIds - Array of product IDs to remove
 * @returns {Promise<boolean>} - True if successful
 */
export const removeMultipleCartItemsFromDatabase = async (userId, productIds) => {
  try {
    if (!userId || !productIds || productIds.length === 0) {
      console.warn('No items to remove');
      return false;
    }
    
    const db = await getDatabase();
    
    // Use prepared statement with multiple placeholders for each ID
    const placeholders = productIds.map(() => '?').join(',');
    
    // Construct the query with userId and multiple product_id conditions
    const query = `DELETE FROM cart WHERE user_id = ? AND product_id IN (${placeholders})`;
    
    // Build params array with userId first, followed by all productIds
    const params = [userId, ...productIds];
    
    console.log(`Removing ${productIds.length} items from cart for user ${userId}`);
    
    // Execute the query
    await db.executeSql(query, params);
    
    return true;
  } catch (error) {
    console.error('Error removing multiple cart items from database:', error);
    throw error;
  }
};