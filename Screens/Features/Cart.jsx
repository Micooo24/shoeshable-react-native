import React, { useEffect, useState, useCallback } from 'react';
import { 
  Text, View, StatusBar, ActivityIndicator, Image,
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
  getProductName, getProductPrice, getProductImage, calculateSubtotal 
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

  const handleCheckout = () => {
    // You can pass cart data and total amount to the checkout screen
    const subtotal = calculateSubtotal(cartItems);
    navigation.navigate('Checkout', { 
      cartItems, 
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
                    marginTop: 12,
                    marginBottom: 70
                  }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                      Total: ₱{calculateSubtotal(cartItems).toFixed(2)}
                    </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: COLORS.primary,
                          padding: 12,
                          borderRadius: 6,
                          alignItems: 'center',
                          marginTop: 16
                        }}
                        onPress={handleCheckout}
                      >
                        <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>
                          Proceed to Checkout
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