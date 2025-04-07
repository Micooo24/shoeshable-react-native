import { Alert } from 'react-native';
import { 
  getCarts, updateCartItemQuantity, removeFromCart, clearCart, updateCartItem
} from '../Redux/actions/cartActions';
import baseURL from '../assets/common/baseurl';

// Utility functions for item data extraction
export const getProductId = (item) => {
  if (item.productId && typeof item.productId === 'object' && item.productId._id) {
    return item.productId._id;
  } else if (typeof item.productId === 'string') {
    return item.productId;
  } else if (item.product_id) {
    return item.product_id;
  }
  return item._id || null;
};

export const getProductName = (item) => {
  return (item.productId && item.productId.name) ? 
    item.productId.name : 
    item.productName || `${item.brand || ''} ${item.category || ''}`;
};

export const getProductPrice = (item) => {
  return (item.productId && item.productId.price) ? 
    parseFloat(item.productId.price) : 
    (item.productPrice ? parseFloat(item.productPrice) : 0);
};

export const getProductImage = (item) => {
  return (item.productId && item.productId.image && item.productId.image[0]) || 
    item.productImage || null;
};

export const calculateSubtotal = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return 0;
  
  return cartItems.reduce((total, item) => {
    return total + (getProductPrice(item) * (item.quantity || 1));
  }, 0);
};

// Create a handlers factory function that requires component state and dispatch
const createCartHandlers = (
  dispatch, 
  setLoading, 
  setIsOffline,
  setModalVisible,
  setSelectedItem,
  setProductDetails,
  setSelectedSize,
  setSelectedColor,
  setLoadingDetails
) => {
  
  // Handler for opening the modal with product details
  const handleOpenModal = async (item) => {
    try {
      // Set initial state
      setSelectedItem(item);
      setSelectedSize(item.size || '');
      setSelectedColor(item.color || '');
      setModalVisible(true);
      setLoadingDetails(true);
      
      // Get product ID directly from the item
      const productId = item.productId?._id || item.product_id || item.productId;
      
      if (!productId) {
        console.error('Cannot identify product ID:', item);
        setLoadingDetails(false);
        return;
      }
      
      console.log(`Fetching product details from: ${baseURL}/api/products/get-product-by-id/${productId}`);
      
      // Use fetch instead of axios
      const response = await fetch(`${baseURL}/api/products/get-product-by-id/${productId}`);
      const data = await response.json();
      
      console.log('Product Details Response:', data);
      
      if (data && data.product) {
        const details = data.product;
        
        // Store the full product details directly from API response
        setProductDetails(details);
        
        // Make sure we're using the right property names from the API response
        setSelectedSize(item.size || (details.size && details.size[0]) || '');
        setSelectedColor(item.color || (details.color && details.color[0]) || '');
      } else {
        console.error('Failed to fetch product details:', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

// Handler for updating cart item properties
const handleUpdateCartItem = async (selectedItem, selectedSize, selectedColor) => {
    try {
      const productId = getProductId(selectedItem);
      
      if (!selectedSize || !selectedColor) {
        Alert.alert('Error', 'Please select both size and color.');
        return;
      }
      
      const updatedFields = {
        size: selectedSize,
        color: selectedColor,
      };
      
      const response = await dispatch(updateCartItem(productId, updatedFields));
      
      if (response && response.success) {
        setModalVisible(false);
        
        // Set offline status if needed
        if (response && response.offline) {
          setIsOffline(true);
        }
        
        Alert.alert('Success', 'Cart item updated successfully.');
      } else {
        Alert.alert('Error', response?.message || 'Failed to update cart item.');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      Alert.alert('Error', 'Failed to update cart item. Please try again.');
    }
  };

// Handler for increasing item quantity
const handleIncreaseQuantity = async (item) => {
  try {
    const productId = getProductId(item);
    const quantity = (item.quantity || 1) + 1;
    
    const response = await dispatch(updateCartItemQuantity(productId, quantity));
    
    if (response && response.offline) {
      setIsOffline(true);
    }
    
    // Refresh the cart display immediately
    dispatch(getCarts()).then(response => {
      if (response && response.offline) {
        setIsOffline(true);
      }
    });
  } catch (error) {
    console.error('Error increasing quantity:', error);
  }
};

// Handler for decreasing item quantity
const handleDecreaseQuantity = async (item) => {
  try {
    const productId = getProductId(item);
    const quantity = (item.quantity || 1) - 1;
    
    let response;
    if (quantity <= 0) {
      response = await dispatch(removeFromCart(productId));
    } else {
      response = await dispatch(updateCartItemQuantity(productId, quantity));
    }
    
    if (response && response.offline) {
      setIsOffline(true);
    }
    
    // Refresh the cart display immediately
    dispatch(getCarts()).then(response => {
      if (response && response.offline) {
        setIsOffline(true);
      }
    });
  } catch (error) {
    console.error('Error decreasing quantity:', error);
  }
};
  // Handler for removing an item from cart
  const handleRemoveItem = async (item) => {
    const productId = getProductId(item);
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              // Only show loading if needed for specific UI element
              const response = await dispatch(removeFromCart(productId));
              
              if (response && response.offline) {
                setIsOffline(true);
              }
              
              // Update cart data without showing loading indicator
              dispatch(getCarts()).then(response => {
                if (response && response.offline) {
                  setIsOffline(true);
                }
              });
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  // Handler for clearing the entire cart
  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await dispatch(clearCart());
              
              if (response && response.offline) {
                setIsOffline(true);
              }
              
              // Update cart data without showing loading indicator
              dispatch(getCarts()).then(response => {
                if (response && response.offline) {
                  setIsOffline(true);
                }
              });
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Failed to clear cart. Please try again.');
            }
          }
        }
      ]
    );
  };

  return {
    handleOpenModal,
    handleUpdateCartItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart
  };
};

export default createCartHandlers;