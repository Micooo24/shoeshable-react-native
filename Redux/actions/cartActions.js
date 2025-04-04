import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    GET_CART,
    UPDATE_CART_ITEM,
    UPDATE_CART_QUANTITY,
    REMOVE_MULTIPLE_FROM_CART  
} from '../constants';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import { getToken } from '../../sqlite_db/Auth';
import { 
    addCartItemToDatabase, 
    getCartItemsFromDatabase,
    updateCartItemInDatabase,
    updateCartItemQuantityInDatabase,
    removeCartItemFromDatabase,
    clearCartFromDatabase,
    removeMultipleCartItemsFromDatabase 
} from '../../sqlite_db/Cart';
import  { jwtDecode }from 'jwt-decode';

const fetchProductDetailsById = async (productId) => {
    try {
      const response = await axios.get(`${baseURL}/api/products/get-product-by-id/${productId}`);
      if (response.data && response.data.product) {
        return response.data.product; // Return the product details
      }
      return null; // Return null if no product is found
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

// SQLite-Only Add to Cart Action
export const addToCart = (product) => {
    return async (dispatch) => {
      try {
        const tokenData = await getToken();
        const authToken = tokenData?.authToken;
  
        if (!authToken) {
          console.error('No auth token found. User might not be logged in.');
          return {
            success: false,
            message: 'Unauthorized. Please log in to add items to the cart.',
          };
        }
  
        const decoded = jwtDecode(authToken);
        const userId = decoded.userId || decoded.id;
        console.log('User ID:', userId);
  
        // Fetch product details if image is not available
        let productImage = null;
        if (Array.isArray(product.image) && product.image.length > 0) {
          productImage = product.image[0]; // Use the first image from the product object
        } else {
          // Fetch product details from the API using productId
          const productDetails = await fetchProductDetailsById(product.productId || product._id);
          if (productDetails && Array.isArray(productDetails.image) && productDetails.image.length > 0) {
            productImage = productDetails.image[0]; // Use the first image from the fetched product details
          }
        }
  
        const cartItem = {
          productId: product.productId || product._id,
          quantity: product.quantity || 1,
          brand: product.brand,
          category: product.category,
          size: product.size,
          color: product.color,
          gender: product.gender,
          productName: product.productName || product.name,
          productPrice: product.productPrice || product.price,
          productImage: productImage, // Assign the fetched or existing image
        };
  
        console.log('Cart Item:', cartItem);
  
        // Add the cart item to the local database only
        await addCartItemToDatabase(userId, cartItem);
        
        // Dispatch directly with the local cart item data
        dispatch({
          type: ADD_TO_CART,
          payload: cartItem,
        });
  
        return {
          success: true,
          message: 'Item added to cart locally. Will sync when online.',
          cartItem: cartItem,
          offline: true,
        };
      } catch (error) {
        console.error('Error adding to cart:', error);
        return {
          success: false,
          message: 'An unexpected error occurred. Please try again.',
        };
      }
    };
  };


// Get Cart Actions with Authenticated User - SQLite Only Version
export const getCarts = () => {
    return async (dispatch) => {
      try {
        // Get the token
        const tokenData = await getToken();
        const authToken = tokenData?.authToken;
  
        if (!authToken) {
          console.error('No auth token found. User might not be logged in.');
          return {
            success: false,
            message: 'Unauthorized. Please log in to view your cart.',
          };
        }
  
        // Decode the token to get the user ID
        const decoded = jwtDecode(authToken);
        const userId = decoded.userId || decoded.id;
  
        if (!userId) {
          console.error('Failed to extract user ID from token:', decoded);
          return {
            success: false,
            message: 'Failed to identify user. Please log in again.',
          };
        }
  
        console.log('Fetching cart items from SQLite for user ID:', userId);
  
        // Get cart items directly from local SQLite database
        const localCartItems = await getCartItemsFromDatabase(userId);
  
        // Dispatch the cart items to the Redux store
        dispatch({
          type: GET_CART,
          payload: localCartItems,
        });
  
        console.log(`Fetched ${localCartItems.length} cart items from local database for user ID: ${userId}`);
  
        return {
          success: true,
          cartItems: localCartItems,
          offline: true, // Always set as offline since we're only using local data
        };
      } catch (error) {
        console.error('Error fetching cart items from SQLite:', error);
        return {
          success: false,
          message: 'Failed to fetch cart items from local database.',
        };
      }
    };
  };

// SQLite-Only Update Cart Item Action
export const updateCartItem = (productId, updatedFields) => {
    return async (dispatch) => {
        try {
            // Get the token
            const tokenData = await getToken();
            const authToken = tokenData?.authToken;

            if (!authToken) {
                console.error('No auth token found. User might not be logged in.');
                return {
                    success: false,
                    message: 'Unauthorized. Please log in to update the cart.',
                };
            }

            // Decode the token to get the user ID
            const decoded = jwtDecode(authToken);
            const userId = decoded.userId || decoded.id;

            if (!userId) {
                console.error('Failed to extract user ID from token:', decoded);
                return {
                    success: false,
                    message: 'Failed to identify user. Please log in again.',
                };
            }
            
            console.log(`Updating cart item in SQLite for user ID: ${userId}, product ID: ${productId}`);
            console.log('Update fields:', updatedFields);
            
            // Update in local database only
            const updatedItem = await updateCartItemInDatabase(userId, productId, updatedFields);
            
            console.log('Updated item result:', updatedItem);
            
            // Dispatch with local data
            dispatch({
                type: UPDATE_CART_ITEM,
                payload: {
                    productId,
                    ...updatedFields,
                    ...(updatedItem || {}) // Include all updated item fields if available
                }
            });

            return {
                success: true,
                message: 'Cart item updated locally.',
                offline: true,
                cartItem: updatedItem || { productId, ...updatedFields }
            };
        } catch (error) {
            console.error('Error updating cart item in SQLite:', error);
            return {
                success: false,
                message: `Failed to update cart item: ${error.message}`,
            };
        }
    };
};

// SQLite-Only Update Cart Item Quantity Action
export const updateCartItemQuantity = (productId, quantity) => {
    return async (dispatch) => {
        try {
            const tokenData = await getToken();
            const authToken = tokenData?.authToken;

            if (!authToken) {
                return {
                    success: false,
                    message: 'Unauthorized. Please log in to update the cart.',
                };
            }

            // Get userId from token
            const decoded = jwtDecode(authToken);
            const userId = decoded.userId || decoded.id;
            
            console.log(`Updating quantity for product ID: ${productId} to ${quantity}`);
            
            // Validate quantity
            if (quantity <= 0) {
                console.warn('Quantity should be greater than zero. Consider using removeFromCart instead.');
            }
            
            // Update quantity in local database first and get the updated item
            const updatedItem = await updateCartItemQuantityInDatabase(userId, productId, quantity);
            
            console.log('SQLite update successful:', updatedItem);

            try {
                // Then sync with server
                const response = await axios.put(
                    `${baseURL}/api/cart/update-quantity`,
                    { productId, quantity },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                // Use server response for Redux store update
                dispatch({
                    type: UPDATE_CART_QUANTITY,
                    payload: response.data.cartItem,
                });

                return {
                    success: true,
                    message: response.data.message || 'Cart item quantity updated successfully.',
                    cartItem: response.data.cartItem,
                };
            } catch (apiError) {
                console.log('Server sync failed, using local data:', apiError.message);
                
                // If API fails, dispatch with local data from SQLite
                dispatch({
                    type: UPDATE_CART_QUANTITY,
                    payload: updatedItem || { productId, quantity },
                });

                return {
                    success: true,
                    message: 'Quantity updated locally. Will sync when online.',
                    cartItem: updatedItem,
                    offline: true
                };
            }
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            return {
                success: false,
                message: error.message || 'Failed to update cart item quantity.',
            };
        }
    };
};

// SQLite-Only Remove Cart Item Action
export const removeFromCart = (productId) => {
    return async (dispatch) => {
      try {
        const tokenData = await getToken();
        const authToken = tokenData?.authToken;
  
        if (!authToken) {
          return {
            success: false,
            message: 'Unauthorized. Please log in to remove items from the cart.',
          };
        }
  
        // Get userId from token
        const decoded = jwtDecode(authToken);
        const userId = decoded.userId || decoded.id;
        
        console.log(`Removing product ID: ${productId} from local database for user: ${userId}`);
        
        // Remove from local database only
        await removeCartItemFromDatabase(userId, productId);
        
        // Dispatch the removal action to update Redux store
        dispatch({
          type: REMOVE_FROM_CART,
          payload: productId,
        });
  
        return {
          success: true,
          message: 'Item removed from cart locally.',
          offline: true
        };
      } catch (error) {
        console.error('Error removing item from cart:', error);
        return {
          success: false,
          message: error.message || 'Failed to remove item from cart.',
        };
      }
    };
  };
  
  // SQLite-Only Clear Cart Action
  export const clearCart = () => {
    return async (dispatch) => {
      try {
        const tokenData = await getToken();
        const authToken = tokenData?.authToken;
  
        if (!authToken) {
          return {
            success: false,
            message: 'Unauthorized. Please log in to clear the cart.',
          };
        }
  
        // Get userId from token
        const decoded = jwtDecode(authToken);
        const userId = decoded.userId || decoded.id;
        
        console.log(`Clearing all cart items from local database for user: ${userId}`);
        
        // Clear local database only
        await clearCartFromDatabase(userId);
        
        // Dispatch the clear action to update Redux store
        dispatch({
          type: CLEAR_CART
        });
  
        return {
          success: true,
          message: 'Cart cleared locally.',
          offline: true
        };
      } catch (error) {
        console.error('Error clearing cart:', error);
        return {
          success: false,
          message: error.message || 'Failed to clear cart.',
        };
      }
    };
  };

  
// SQLite-Only Remove Multiple Cart Items Action
export const removeMultipleFromCart = (productIds) => {
  return async (dispatch) => {
    try {
      const tokenData = await getToken();
      const authToken = tokenData?.authToken;

      if (!authToken) {
        return {
          success: false,
          message: 'Unauthorized. Please log in to remove items from the cart.',
        };
      }

      // Get userId from token
      const decoded = jwtDecode(authToken);
      const userId = decoded.userId || decoded.id;
      
      console.log(`Removing ${productIds.length} items from local database for user: ${userId}`);
      
      // Remove from local database only
      await removeMultipleCartItemsFromDatabase(userId, productIds);
      
      // Dispatch the removal action to update Redux store
      dispatch({
        type: REMOVE_MULTIPLE_FROM_CART,
        payload: productIds,
      });

      return {
        success: true,
        message: `${productIds.length} items removed from cart locally.`,
        offline: true
      };
    } catch (error) {
      console.error('Error removing multiple items from cart:', error);
      return {
        success: false,
        message: error.message || 'Failed to remove items from cart.',
      };
    }
  };
};