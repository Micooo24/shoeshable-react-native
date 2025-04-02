import React, { useEffect, useState } from 'react';
import { Text, View, StatusBar, FlatList, ActivityIndicator, Image, Modal, TouchableOpacity, Button } from 'react-native';
import BottomNavigator from '../../Navigators/BottomNavigator';
import { styles } from '../../Styles/cart';
import { COLORS } from '../../Theme/color';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { getCarts, updateCartItem } from '../../Redux/actions/cartActions'; // Import the getCarts and updateCartItem actions
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons from MaterialIcons
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdowns
import baseURL from '../../assets/common/baseurl'

const CartScreen = ({ navigation, product }) => {
  const dispatch = useDispatch();

  const { cartItems, totalQuantity, totalPrice } = useSelector((state) => state.cart); // Access cart state
  const [loading, setLoading] = useState(true); // Loading state
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedItem, setSelectedItem] = useState(null); // Selected cart item
  const [updatedSize, setUpdatedSize] = useState(''); // Updated size
  const [updatedColor, setUpdatedColor] = useState(''); // Updated color

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true); // Show loading indicator
        const response = await dispatch(getCarts());
        if (!response.success) {
          console.error('Failed to fetch cart items:', response.message);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchCartItems();
  }, [dispatch]);

  const handleOpenModal = async (item) => {
    try {
      setSelectedItem(item); // Set the selected cart item
      setUpdatedSize(item.size); // Pre-fill the current size
      setUpdatedColor(item.color); // Pre-fill the current color
  
      // Fetch product details for the specific product
      const response = await fetch(`http://your-backend-url/api/products/${item.productId._id}`);
      const productDetails = await response.json();
  
      if (productDetails.success) {
        // Update the selected item with the possible sizes and colors
        setSelectedItem((prev) => ({
          ...prev,
          productId: {
            ...prev.productId,
            size: productDetails.product.size,
            color: productDetails.product.color,
          },
        }));
      } else {
        console.error('Failed to fetch product details:', productDetails.message);
      }
  
      setModalVisible(true); // Open the modal
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleUpdateCartItem = async () => {
    if (selectedItem) {
      await dispatch(updateCartItem(selectedItem.productId, { size: updatedSize, color: updatedColor }));
      setModalVisible(false); // Close the modal
    }
  };

  const renderCartItem = ({ item }) => {
  return (
    <TouchableOpacity onPress={() => handleOpenModal(item)}> {/* Open modal on click */}
      <View style={styles.cartItem}>
        {/* Product Image */}
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

        {/* Product Name */}
        <Text style={styles.cartItemText}>
          {item.productId && item.productId.name ? item.productId.name : `${item.brand} ${item.category}`}
        </Text>

        {/* Product Details */}
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

        {/* Product Price */}
        <Text style={styles.cartItemPrice}>
          ₱{item.productId && item.productId.price ? (item.productId.price * item.quantity).toFixed(2) : 'N/A'}
        </Text>

        {/* Action Buttons */}
        <View style={styles.cartItemActions}>
          {/* Decrease Quantity */}
          <TouchableOpacity>
            <Icon
              name="remove-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          {/* Increase Quantity */}
          <TouchableOpacity>
            <Icon
              name="add-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            {/* Delete Item */}
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

      {/* Cart Content */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : cartItems.length > 0 ? (
          <>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item._id} // Use _id as the unique key
              contentContainerStyle={styles.cartList}
            />
            <View style={styles.cartSummary}>
              <Text style={styles.summaryText}>Total Quantity: {totalQuantity}</Text>
              <Text style={styles.summaryText}>Total Price: ${totalPrice.toFixed(2)}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>Cart is empty</Text>
        )}
      </View>

      {/* Modal for Updating Size and Color */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Display Product Images */}
            {selectedItem?.productId?.image && (
              <FlatList
                data={selectedItem.productId.image}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )}
                style={styles.imageList}
              />
            )}

            {/* Display Product Name */}
            <Text style={styles.modalTitle}>{selectedItem?.productId?.name}</Text>

            {/* Display Current Size and Color */}
            <Text style={styles.modalText}>Current Size: {selectedItem?.size}</Text>
            <Text style={styles.modalText}>Current Color: {selectedItem?.color}</Text>

            {/* Dropdown for Size */}
            <Picker
              selectedValue={updatedSize}
              onValueChange={(itemValue) => setUpdatedSize(itemValue)}
              style={styles.dropdown}
            >
              {selectedItem?.item?.size?.map((size) => (
                <Picker.Item key={size.toString()} label={size.toString()} value={size.toString()} />
              ))}
            </Picker>

            {/* Dropdown for Color */}
            <Picker
              selectedValue={updatedColor}
              onValueChange={(itemValue) => setUpdatedColor(itemValue)}
              style={styles.dropdown}
            >
              {selectedItem?.item?.color?.map((color) => (
                <Picker.Item key={color.toString()} label={color.toString()} value={color.toString()} />
              ))}
            </Picker>

            {/* Buttons */}
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