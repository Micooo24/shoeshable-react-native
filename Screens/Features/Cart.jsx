import React, { useEffect, useState } from 'react';
import { Text, View, StatusBar, FlatList, ActivityIndicator, Image } from 'react-native';
import BottomNavigator from '../../Navigators/BottomNavigator';
import { styles } from '../../Styles/cart';
import { COLORS } from '../../Theme/color';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { getCarts } from '../../Redux/actions/cartActions'; // Import the getCarts action
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons from MaterialIcons
import { TouchableOpacity } from 'react-native'; 

const CartScreen = ({ navigation, product }) => {
  const dispatch = useDispatch();

 
  const { cartItems, totalQuantity, totalPrice } = useSelector((state) => state.cart); // Access cart state
  const [loading, setLoading] = useState(true); // Loading state

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

  

  const renderCartItem = ({ item }) => {
    return (
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Cart" />
      </View>
    </View>
  );
};

export default CartScreen;