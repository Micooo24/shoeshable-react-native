import React, { useEffect, useState, useCallback } from 'react';
import { 
  Text, View, StatusBar, ActivityIndicator, Image, Alert,
  TouchableOpacity, ScrollView, Modal, SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { styles } from '../../Styles/cart';
import { COLORS } from '../../Theme/color';
import { useDispatch, useSelector } from 'react-redux';
import { getCarts } from '../../Redux/actions/cartActions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigator from '../../Navigators/BottomNavigator';
import { getToken } from '../../sqlite_db/Auth';
import { jwtDecode } from 'jwt-decode';
import createCartHandlers, { 
  getProductId, getProductName, getProductPrice, getProductImage, calculateSubtotal 
} from '../../utils/cartHandlers';

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
  
  // Add state for cart item selection
  const [selectedCartItems, setSelectedCartItems] = useState({});

  // Create handlers with access to component state and dispatch
  const handlers = createCartHandlers(
    dispatch, 
    setLoading, 
    setIsOffline,
    setModalVisible,
    setSelectedItem,
    setProductDetails,
    setSelectedSize,
    setSelectedColor,
    setLoadingDetails
  );
  
  // Use destructuring to get all handler functions
  const { 
    handleOpenModal,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart
  } = handlers;

  // Add toggle selection function
  const toggleItemSelection = (item) => {
    const itemId = getProductId(item);
    setSelectedCartItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Add select all / deselect all functions
  const selectAllItems = () => {
    const newSelection = {};
    cartItems.forEach(item => {
      newSelection[getProductId(item)] = true;
    });
    setSelectedCartItems(newSelection);
  };

  const deselectAllItems = () => {
    setSelectedCartItems({});
  };

  // Count selected items
  const selectedItemsCount = Object.values(selectedCartItems).filter(Boolean).length;

  // Updated checkout handler that only processes selected items
// Updated checkout handler that includes product name and image array

const handleCheckout = () => {
  // Check if any items are selected
  if (selectedItemsCount === 0) {
    Alert.alert("No Items Selected", "Please select at least one item to proceed to checkout.");
    return;
  }

  // Filter only the selected items
  const selectedIds = Object.keys(selectedCartItems).filter(id => selectedCartItems[id]);
  const itemsToCheckout = cartItems.filter(item => selectedIds.includes(getProductId(item)));
  
  // Enhance the cart items with properly formatted product names and image arrays
  const enhancedItems = itemsToCheckout.map(item => {
    // Get original product name using the utility function
    const productName = getProductName(item);
    
    // Format product image as array (even if it's a single string)
    let productImage;
    if (Array.isArray(item.productImage)) {
      productImage = item.productImage; // Already an array
    } else if (item.productImage) {
      productImage = [item.productImage]; // Convert single image to array
    } else if (item.productId?.image) {
      // Use product image from the product object if available
      productImage = Array.isArray(item.productId.image) 
        ? item.productId.image 
        : [item.productId.image];
    } else {
      productImage = []; // No image available
    }
    
    // Return enhanced item with all original properties plus formatted ones
    return {
      ...item,
      productName,
      productImage,
      // Include any other needed fields
      productPrice: getProductPrice(item),
      originalProductId: item.productId?._id || item.productId || item._id,
    };
  });
  
  // Calculate subtotal of only selected items
  const subtotal = calculateSubtotal(itemsToCheckout);
  
  // Navigate to checkout with enhanced items
  navigation.navigate('Checkout', { 
    cartItems: enhancedItems, 
    subtotal,
    userId
  });
}

  // Create a wrapped version of handleUpdateCartItem that includes the needed state
  const handleUpdateCartItem = useCallback(() => {
    handlers.handleUpdateCartItem(selectedItem, selectedSize, selectedColor);
  }, [handlers, selectedItem, selectedSize, selectedColor]);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background || '#f5f5f5' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={{ flex: 1 }}>
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Icon name="cloud-off" size={16} color="white" />
            <Text style={styles.offlineBannerText}>
              Offline Mode - Changes will sync when online
            </Text>
          </View>
        )}
        
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={true}
          bounces={true}
          overScrollMode="always"
        >
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Cart Items ({cartItems?.length || 0})
                </Text>
                
                {cartItems && cartItems.length > 0 && (
                  <TouchableOpacity 
                    onPress={selectedItemsCount === cartItems.length ? deselectAllItems : selectAllItems}
                  >
                    <Text style={{ color: COLORS.primary, fontWeight: '500' }}>
                      {selectedItemsCount === cartItems.length ? 'Deselect All' : 'Select All'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
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
                  {cartItems.map((item, index) => {
                    const itemId = getProductId(item);
                    const isSelected = !!selectedCartItems[itemId];
                    
                    return (
                      <View 
                        key={index}
                        style={{
                          backgroundColor: isSelected ? '#f0f8ff' : COLORS.white,
                          borderRadius: 8,
                          marginBottom: 12,
                          borderWidth: 1,
                          borderColor: isSelected ? COLORS.primary : 'transparent',
                        }}
                      >
                        <View style={{ flexDirection: 'row', padding: 16 }}>
                          <TouchableOpacity 
                            onPress={() => toggleItemSelection(item)}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              borderWidth: 2,
                              borderColor: COLORS.primary,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: isSelected ? COLORS.primary : 'transparent',
                              marginRight: 12,
                              alignSelf: 'center'
                            }}
                          >
                            {isSelected && <Icon name="check" size={16} color="white" />}
                          </TouchableOpacity>

                          <TouchableOpacity 
                            style={{ flex: 1, flexDirection: 'row' }}
                            onPress={() => handleOpenModal(item)}
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
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}

                  <View style={{
                    backgroundColor: COLORS.white,
                    borderRadius: 8,
                    padding: 16,
                    marginTop: 12,
                    marginBottom: 70
                  }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                      Total: ₱{calculateSubtotal(cartItems).toFixed(2)}
                    </Text>
                    
                    <Text style={{ 
                      fontSize: 14, 
                      marginTop: 8, 
                      color: selectedItemsCount > 0 ? COLORS.primary : '#666',
                      fontWeight: selectedItemsCount > 0 ? 'bold' : 'normal'
                    }}>
                      Selected for checkout: {selectedItemsCount} items
                    </Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.primary,
                        padding: 12,
                        borderRadius: 6,
                        alignItems: 'center',
                        marginTop: 16,
                        opacity: selectedItemsCount > 0 ? 1 : 0.6
                      }}
                      onPress={handleCheckout}
                      disabled={selectedItemsCount === 0}
                    >
                      <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>
                        {selectedItemsCount > 0 
                          ? `Checkout Selected (${selectedItemsCount})` 
                          : "Select items for checkout"}
                      </Text>
                    </TouchableOpacity>
                    
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

        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.white,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        }}>
          <BottomNavigator navigation={navigation} activeScreen="Cart" />
        </View>
      </View>

      {/* Modal remains the same */}
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
    </SafeAreaView>
  );
};

export default CartScreen;