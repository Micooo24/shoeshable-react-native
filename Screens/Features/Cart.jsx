import React, { useEffect, useState } from 'react';
import { 
  Text, View, StatusBar, ActivityIndicator, Image,
  TouchableOpacity, ScrollView, Alert, Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { styles } from '../../Styles/cart';
import { COLORS } from '../../Theme/color';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getCarts, updateCartItemQuantity, removeFromCart, clearCart, updateCartItem
} from '../../Redux/actions/cartActions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigator from '../../Navigators/BottomNavigator';
import { getToken } from '../../sqlite_db/Auth';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const tokenData = await getToken();
        if (tokenData && tokenData.authToken) {
          const decoded = jwtDecode(tokenData.authToken);
          setUserId(decoded.userId || decoded.id);
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await dispatch(getCarts());
        
        if (response && response.offline) {
          setIsOffline(true);
        }
        
        if (!response.success) {
          console.error('Failed to fetch cart items:', response.message);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [dispatch, userId]);

  const getProductId = (item) => {
    if (item.productId && typeof item.productId === 'object' && item.productId._id) {
      return item.productId._id;
    } else if (typeof item.productId === 'string') {
      return item.productId;
    } else if (item.product_id) {
      return item.product_id;
    }
    return item._id || null;
  };

  const getProductName = (item) => {
    return (item.productId && item.productId.name) ? 
      item.productId.name : 
      item.productName || `${item.brand || ''} ${item.category || ''}`;
  };

  const getProductPrice = (item) => {
    return (item.productId && item.productId.price) ? 
      parseFloat(item.productId.price) : 
      (item.productPrice ? parseFloat(item.productPrice) : 0);
  };

  const getProductImage = (item) => {
    return (item.productId && item.productId.image && item.productId.image[0]) || 
      item.productImage || null;
  };

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

  const handleUpdateCartItem = async () => {
    try {
      setLoading(true);
      const productId = getProductId(selectedItem);
      
      if (!selectedSize || !selectedColor) {
        Alert.alert('Error', 'Please select both size and color.');
        setLoading(false);
        return;
      }
      
      const updatedFields = {
        size: selectedSize,
        color: selectedColor,
      };
      
      const response = await dispatch(updateCartItem(productId, updatedFields));
      
      if (response && response.success) {
        setModalVisible(false);
        await dispatch(getCarts());
        Alert.alert('Success', 'Cart item updated successfully.');
      } else {
        Alert.alert('Error', response?.message || 'Failed to update cart item.');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      Alert.alert('Error', 'Failed to update cart item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = async (item) => {
    try {
      setLoading(true);
      const productId = getProductId(item);
      const quantity = (item.quantity || 1) + 1;
      
      const response = await dispatch(updateCartItemQuantity(productId, quantity));
      if (response && response.offline) {
        setIsOffline(true);
      }
      
      await dispatch(getCarts());
    } catch (error) {
      console.error('Error increasing quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseQuantity = async (item) => {
    try {
      setLoading(true);
      const productId = getProductId(item);
      const quantity = (item.quantity || 1) - 1;
      
      if (quantity <= 0) {
        await dispatch(removeFromCart(productId));
      } else {
        await dispatch(updateCartItemQuantity(productId, quantity));
      }
      
      await dispatch(getCarts());
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    } finally {
      setLoading(false);
    }
  };

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
              setLoading(true);
              const response = await dispatch(removeFromCart(productId));
              
              if (response && response.offline) {
                setIsOffline(true);
              }
              
              await dispatch(getCarts());
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

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
              setLoading(true);
              const response = await dispatch(clearCart());
              
              if (response && response.offline) {
                setIsOffline(true);
              }
              
              await dispatch(getCarts());
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Failed to clear cart. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      return total + (getProductPrice(item) * (item.quantity || 1));
    }, 0);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Icon name="cloud-off" size={16} color="white" />
          <Text style={styles.offlineBannerText}>
            Offline Mode - Changes will sync when online
          </Text>
        </View>
      )}
      
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
              Cart Items ({cartItems?.length || 0})
            </Text>
            
            {!cartItems || cartItems.length === 0 ? (
              <View style={{ 
                padding: 20, 
                backgroundColor: COLORS.white,
                borderRadius: 8,
                alignItems: 'center'
              }}>
                <Icon name="shopping-cart" size={50} color={COLORS.textLight} />
                <Text style={styles.emptyText}>Your cart is empty</Text>
              </View>
            ) : (
              <View>
                {cartItems.map((item, index) => (
                  <TouchableOpacity 
                    key={index}
                    onPress={() => handleOpenModal(item)}
                  >
                    <View 
                      style={{
                        padding: 16,
                        backgroundColor: COLORS.white,
                        borderRadius: 8,
                        marginBottom: 12,
                        flexDirection: 'row'
                      }}
                    >
                      <View style={{ width: 80, height: 80, marginRight: 12 }}>
                        {getProductImage(item) ? (
                          <Image 
                            source={{ uri: getProductImage(item) }}
                            style={{ width: '100%', height: '100%', borderRadius: 4 }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={{ 
                            width: '100%', 
                            height: '100%', 
                            backgroundColor: '#f0f0f0',
                            borderRadius: 4,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <Icon name="image-not-supported" size={24} color="#999" />
                          </View>
                        )}
                      </View>
                      
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                          {getProductName(item)}
                        </Text>
                        <Text>Size: {item.size || 'N/A'}</Text>
                        <Text>Color: {item.color || 'N/A'}</Text>
                        <Text>Price: ₱{getProductPrice(item).toFixed(2)}</Text>
                        
                        <View style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center',
                          marginTop: 8,
                          justifyContent: 'space-between'
                        }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => handleDecreaseQuantity(item)}>
                              <Icon name="remove-circle" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8, minWidth: 20, textAlign: 'center' }}>
                              {item.quantity || 1}
                            </Text>
                            <TouchableOpacity onPress={() => handleIncreaseQuantity(item)}>
                              <Icon name="add-circle" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                          </View>
                          
                          <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                            <Icon name="delete" size={24} color={COLORS.danger} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                <View style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 8,
                  padding: 16,
                  marginTop: 12
                }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    Total: ₱{calculateSubtotal().toFixed(2)}
                  </Text>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.danger,
                      padding: 12,
                      borderRadius: 6,
                      alignItems: 'center',
                      marginTop: 16
                    }}
                    onPress={handleClearCart}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>
                      Clear Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Item</Text>
            
            {loadingDetails ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <>
                {selectedItem && (
                  <View>
                    <Text style={styles.modalText}>
                      {productDetails?.name || getProductName(selectedItem)}
                    </Text>
                    
                    <Text style={styles.dropdownLabel}>Size</Text>
                    <View style={styles.dropdown}>
                      <Picker
                        selectedValue={selectedSize}
                        onValueChange={(value) => setSelectedSize(value)}
                      >
                        <Picker.Item label="Select Size" value="" />
                        {productDetails?.size?.map((size, index) => (
                          <Picker.Item key={index} label={size} value={size} />
                        ))}
                      </Picker>
                    </View>
                    
                    <Text style={styles.dropdownLabel}>Color</Text>
                    <View style={styles.dropdown}>
                      <Picker
                        selectedValue={selectedColor}
                        onValueChange={(value) => setSelectedColor(value)}
                      >
                        <Picker.Item label="Select Color" value="" />
                        {productDetails?.color?.map((color, index) => (
                          <Picker.Item key={index} label={color} value={color} />
                        ))}
                      </Picker>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.button, styles.updateButton]}
                        onPress={handleUpdateCartItem}
                      >
                        <Text style={styles.buttonText}>Update</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Cart" />
      </View>
    </View>
  );
};

export default CartScreen;