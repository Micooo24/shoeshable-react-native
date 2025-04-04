import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../Theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Checkout = ({ navigation, route }) => {
  // Extract parameters passed from Cart screen
  const { cartItems, subtotal, userId } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {cartItems && cartItems.length > 0 ? (
            <View>
              {cartItems.map((item, index) => (
                <View key={index} style={styles.cartItem}>
                  <Text style={styles.itemName}>{item.productId?.name || "Product"}</Text>
                  <Text>Size: {item.size || 'N/A'}</Text>
                  <Text>Color: {item.color || 'N/A'}</Text>
                  <Text>Quantity: {item.quantity || 1}</Text>
                  <Text style={styles.itemPrice}>
                    ₱{((item.productId?.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </Text>
                </View>
              ))}
              
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>₱{subtotal ? subtotal.toFixed(2) : "0.00"}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyMessage}>No items in cart</Text>
          )}
        </View>
        
        {/* Add more checkout sections here */}
        
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#f5f5f5',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemPrice: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  paymentButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  paymentButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Checkout;