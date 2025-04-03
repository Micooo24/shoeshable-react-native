import React, { useEffect, useState } from 'react';
import { 
  Text, View, StatusBar, FlatList, ActivityIndicator, 
  Image, Modal, TouchableOpacity, ScrollView 
} from 'react-native';
import BottomNavigator from '../../Navigators/BottomNavigator';
import { styles } from '../../Styles/cart';
import { COLORS } from '../../Theme/color';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getCarts, updateCartItem, updateCartItemQuantity, 
  removeFromCart, clearCart 
} from '../../Redux/actions/cartActions'; // Added clearCart import
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import baseURL from '../../assets/common/baseurl';

const CartScreen = ({ navigation, product }) => {
  const dispatch = useDispatch();

  const { cartItems, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedSize, setUpdatedSize] = useState('');
  const [updatedColor, setUpdatedColor] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getCarts());
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
  }, [dispatch]);

  const handleOpenModal = async (item) => {
    try {
      setSelectedItem(item);
      setUpdatedSize(item.size);
      setUpdatedColor(item.color);
    
      const url = `${baseURL}/api/products/get-product-by-id/${item.productId._id}`;
      console.log(`Fetching product details from: ${url}`);
      const response = await fetch(url);
      const productDetails = await response.json();
    
      console.log('Product Details Response:', productDetails);
    
      if (productDetails.product) {
        setSelectedItem((prev) => ({
          ...prev,
          productId: {
            ...prev.productId,
            size: productDetails.product.size || [],
            color: productDetails.product.color || [],
            name: productDetails.product.name || 'Unnamed Product',
          },
        }));
      } else {
        console.error('Failed to fetch product details:', productDetails.message || 'Unknown error');
      }
    
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleUpdateCartItem = async () => {
    if (selectedItem) {
      try {
        setLoading(true);
        
        await dispatch(updateCartItem(selectedItem.productId._id, { 
          size: updatedSize, 
          color: updatedColor 
        }));
        
        await dispatch(getCarts());
        setModalVisible(false);
      } catch (error) {
        console.error("Error updating cart item:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleIncreaseQuantity = async (productId, currentQuantity) => {
    try {
      setLoading(true);
      await dispatch(updateCartItemQuantity(productId, currentQuantity + 1));
      await dispatch(getCarts());
    } catch (error) {
      console.error('Error increasing quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseQuantity = async (productId, currentQuantity) => {
    try {
      setLoading(true);
      if (currentQuantity === 1) {
        await dispatch(removeFromCart(productId));
      } else {
        await dispatch(updateCartItemQuantity(productId, currentQuantity - 1));
      }
      await dispatch(getCarts());
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setLoading(true);
      const response = await dispatch(removeFromCart(productId));
      if (!response.success) {
        console.error('Failed to remove item:', response.message);
      } else {
        console.log(response.message);
      }
      await dispatch(getCarts());
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      const response = await dispatch(clearCart());
      if (!response.success) {
        console.error('Failed to clear cart:', response.message);
      } else {
        console.log(response.message);
      }
      await dispatch(getCarts()); // Add this to refresh the UI
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to your CartScreen component
const calculateSubtotal = () => {
  if (!cartItems || cartItems.length === 0) return 0;
  
  return cartItems.reduce((total, item) => {
    const itemPrice = item.productId && item.productId.price 
      ? parseFloat(item.productId.price) * item.quantity 
      : 0;
    return total + itemPrice;
  }, 0);
};

  const renderCartItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleOpenModal(item)}>
        <View style={styles.cartItem}>
          {item.productId && item.productId.image ? (
            <Image
              source={{ uri: item.productId.image[0] }}
              style={styles.cartItemImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.cartItemImagePlaceholder}>
              <Text style={styles.cartItemImagePlaceholderText}>No Image</Text>
            </View>
          )}

          <Text style={styles.cartItemText}>
            {item.productId && item.productId.name ? item.productId.name : `${item.brand} ${item.category}`}
          </Text>

          <View style={styles.cartItemDetailsContainer}>
            <Text style={styles.cartItemDetails}>
              Size: {item.size}
            </Text>
            <Text style={styles.cartItemDetails}>
              Color: {item.color}
            </Text>
            <Text style={styles.cartItemDetails}>
              Quantity: {item.quantity}
            </Text>
          </View>

          <Text style={styles.cartItemPrice}>
            ₱{item.productId && item.productId.price ? (item.productId.price * item.quantity).toFixed(2) : 'N/A'}
          </Text>

          <View style={styles.cartItemActions}>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(item.productId._id, item.quantity)}>
              <Icon
                name="remove-circle-outline"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleIncreaseQuantity(item.productId._id, item.quantity)}>
              <Icon
                name="add-circle-outline"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveItem(item.productId._id)}>
              <Icon
                name="delete-outline"
                size={24}
                color={COLORS.danger}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Main content with ScrollView */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }} // Add bottom padding for the navigation
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
          ) : cartItems.length > 0 ? (
            <>
              {/* Replace FlatList with direct mapping for better ScrollView integration */}
              {cartItems.map(item => (
                <View key={String(item._id)}>
                  {renderCartItem({ item })}
                </View>
              ))}
              
              <View style={styles.cartSummary}>
                <Text style={styles.summaryText}>
                  Total Quantity: {String(totalQuantity || 0)}
                </Text>
                <Text style={styles.summaryText}>
                  Total Price: {'₱' + calculateSubtotal().toFixed(2)}
                </Text>

                <TouchableOpacity
                  style={styles.clearCartButton}
                  onPress={handleClearCart}
                >
                  <Text style={styles.clearCartButtonText}>Clear Cart</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Cart is empty</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal with ScrollView for its content */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.modalContent}>
              {Array.isArray(selectedItem?.productId?.image) && (
                <FlatList
                  data={selectedItem.productId.image}
                  horizontal
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: String(item || '') }}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  )}
                  style={styles.imageList}
                />
              )}

              <Text style={styles.modalTitle}>
                {selectedItem?.productId?.name || 'Unnamed Product'}
              </Text>
              
              <Text style={styles.modalText}>
                Current Size: {selectedItem?.size || 'N/A'}
                {"\n"}
                Current Color: {selectedItem?.color || 'N/A'}
              </Text>

              <Text style={styles.dropdownLabel}>Select Size:</Text>
              <Picker
                selectedValue={updatedSize}
                onValueChange={(itemValue) => setUpdatedSize(itemValue)}
                style={styles.dropdown}
              >
                {Array.isArray(selectedItem?.productId?.size) && selectedItem.productId.size.length > 0 ? (
                  selectedItem.productId.size.map((size) => (
                    <Picker.Item key={String(size)} label={String(size)} value={String(size)} />
                  ))
                ) : (
                  <Picker.Item label="No sizes available" value="" />
                )}
              </Picker>

              <Text style={styles.dropdownLabel}>Select Color:</Text>
              <Picker
                selectedValue={updatedColor}
                onValueChange={(itemValue) => setUpdatedColor(itemValue)}
                style={styles.dropdown}
              >
                {Array.isArray(selectedItem?.productId?.color) && selectedItem.productId.color.length > 0 ? (
                  selectedItem.productId.color.map((color) => (
                    <Picker.Item key={String(color)} label={String(color)} value={String(color)} />
                  ))
                ) : (
                  <Picker.Item label="No colors available" value="" />
                )}
              </Picker>
                
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={handleUpdateCartItem}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Cart" />
      </View>
    </View>
  );
};

export default CartScreen;