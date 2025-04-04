import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, SafeAreaView, TouchableOpacity, 
  Image, Modal, ActivityIndicator, Alert, FlatList
} from 'react-native';
import { COLORS } from '../../Theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../Styles/checkout';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import { getToken } from '../../sqlite_db/Auth';

const Checkout = ({ navigation, route }) => {
  // Extract parameters passed from Cart screen
  const { cartItems, subtotal, userId } = route.params || {};
  
  // State for address modal
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // New state for shipping, vouchers, and payment options
  const shippingFee = 100; // Fixed 100 pesos shipping fee
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({
    id: 1, 
    name: 'Cash on Delivery',
    icon: 'payments'
  });

  // Sample vouchers - in a real app, these would come from an API
  const availableVouchers = [
    { id: 1, code: 'WELCOME10', discount: 10, description: '10% off your first order' },
    { id: 2, code: 'SAVE15', discount: 15, description: '15% off all items' },
    { id: 3, code: 'LOYALTY20', discount: 20, description: '20% off for loyal customers' }
  ];

  // Sample payment methods - in a real app, these would come from an API
  const paymentMethods = [
    { id: 1, name: 'Cash on Delivery', icon: 'payments' },
    { id: 2, name: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 3, name: 'GCash', icon: 'account-balance-wallet' }
  ];

  // Calculate discount amount
  const getDiscountAmount = () => {
    if (!selectedVoucher || !subtotal) return 0;
    return (subtotal * selectedVoucher.discount) / 100;
  };

  // Calculate final total
  const getFinalTotal = () => {
    if (!subtotal) return 0;
    const discountAmount = getDiscountAmount();
    return subtotal + shippingFee - discountAmount;
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get the auth token
      const tokenData = await getToken();
      if (!tokenData || !tokenData.authToken) {
        Alert.alert("Authentication Error", "Please login to continue");
        return;
      }
      
      // Make API request with auth token
      const response = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${tokenData.authToken}` }
      });
      
      if (response.data && response.data.success && response.data.user) {
        const { firstName, lastName, phoneNumber, address, zipCode } = response.data.user;
        
        // Set user profile data
        setUserProfile({
          firstName,
          lastName,
          phoneNumber,
          address,
          zipCode
        });
        
        console.log("User profile fetched:", { firstName, lastName, phoneNumber, address, zipCode });
      } else {
        console.error("Invalid response format", response.data);
        Alert.alert("Error", "Failed to fetch address information");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to fetch address information");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle address selection
  const handleSelectAddress = () => {
    setSelectedAddress(userProfile);
    setAddressModalVisible(false);
  };
  
  // Open address modal and fetch user data
  const openAddressModal = () => {
    setAddressModalVisible(true);
    fetchUserProfile();
  };

  // Select voucher handler
  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setVoucherModalVisible(false);
  };

  // Select payment method handler
  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
    setPaymentModalVisible(false);
  };

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
                  <View style={styles.itemHeader}>
                    {/* Display the product image if available */}
                    {item.productImage && item.productImage.length > 0 && (
                      <Image 
                        source={{ uri: item.productImage[0] }} 
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.itemDetails}>
                      {/* Use the enhanced productName property */}
                      <Text style={styles.itemName}>{item.productName || "Product"}</Text>
                      <Text style={styles.itemMeta}>Size: {item.size || 'N/A'}</Text>
                      <Text style={styles.itemMeta}>Color: {item.color || 'N/A'}</Text>
                      <Text style={styles.itemQuantity}>Quantity: {item.quantity || 1}</Text>
                      {/* Use the enhanced productPrice property */}
                      <Text style={styles.itemPrice}>
                        ₱{((item.productPrice || 0) * (item.quantity || 1)).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyMessage}>No items in cart</Text>
          )}
        </View>
        
        {/* Shipping Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          
          {selectedAddress ? (
            <View style={styles.addressSaved}>
              {/* User's full name at the top */}
              <View style={styles.addressHeader}>
                <Icon name="person" size={22} color={COLORS.primary} style={styles.addressIcon} />
                <Text style={styles.addressName}>
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </Text>
              </View>
              
              {/* Physical address with icon */}
              <View style={styles.addressRow}>
                <Icon name="location-on" size={22} color={COLORS.primary} style={styles.addressIcon} />
                <Text style={styles.addressDetails}>{selectedAddress.address}</Text>
              </View>
              
              {/* Zip code with icon */}
              <View style={styles.addressRow}>
                <Icon name="markunread-mailbox" size={22} color={COLORS.primary} style={styles.addressIcon} />
                <Text style={styles.addressDetails}>Zip Code: {selectedAddress.zipCode}</Text>
              </View>
              
              {/* Phone with icon */}
              <View style={styles.addressRow}>
                <Icon name="phone" size={22} color={COLORS.primary} style={styles.addressIcon} />
                <Text style={styles.addressDetails}>{selectedAddress.phoneNumber}</Text>
              </View>
              
              {/* Change address button */}
              <TouchableOpacity 
                style={[styles.addressButton, {marginTop: 15}]}
                onPress={openAddressModal}
              >
                <Icon name="edit" size={20} color={COLORS.primary} />
                <Text style={styles.addressButtonText}>Change Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addressButton}
              onPress={openAddressModal}
            >
              <Icon name="add-location" size={20} color={COLORS.primary} />
              <Text style={styles.addressButtonText}>Add Shipping Address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Voucher Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discount Voucher</Text>
          {selectedVoucher ? (
            <View style={styles.voucherSelected}>
              <View style={styles.voucherInfo}>
                <Icon name="local-offer" size={22} color={COLORS.primary} style={styles.voucherIcon} />
                <View>
                  <Text style={styles.voucherCode}>{selectedVoucher.code}</Text>
                  <Text style={styles.voucherDiscount}>{selectedVoucher.discount}% Off</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.voucherButton}
                onPress={() => setVoucherModalVisible(true)}
              >
                <Icon name="edit" size={20} color={COLORS.primary} />
                <Text style={styles.voucherButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.voucherButton}
              onPress={() => setVoucherModalVisible(true)}
            >
              <Icon name="local-offer" size={20} color={COLORS.primary} />
              <Text style={styles.voucherButtonText}>Select Voucher</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentSelected}>
            <Icon name={selectedPayment.icon} size={22} color={COLORS.primary} style={styles.paymentIcon} />
            <Text style={styles.paymentMethodText}>{selectedPayment.name}</Text>
            <TouchableOpacity 
              style={styles.changePaymentButton}
              onPress={() => setPaymentModalVisible(true)}
            >
              <Text style={styles.changePaymentText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>₱{subtotal ? subtotal.toFixed(2) : "0.00"}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping Fee:</Text>
              <Text style={styles.summaryValue}>₱{shippingFee.toFixed(2)}</Text>
            </View>
            
            {selectedVoucher && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount ({selectedVoucher.discount}%):</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>-₱{getDiscountAmount().toFixed(2)}</Text>
              </View>
            )}
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>₱{getFinalTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.paymentButton,
            (!selectedAddress || !cartItems || cartItems.length === 0) && styles.disabledButton
          ]}
          disabled={!selectedAddress || !cartItems || cartItems.length === 0}
          onPress={() => Alert.alert("Order Placed", "Your order has been submitted successfully!")}
        >
          <Text style={styles.paymentButtonText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Address Modal */}
      <Modal
        visible={addressModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Shipping Address</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{marginVertical: 20}} />
            ) : userProfile ? (
              <View style={styles.addressForm}>
                {/* Separated first name and last name in modal */}
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>First Name:</Text>
                  <Text style={styles.formValue}>{userProfile.firstName}</Text>
                </View>
                
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Last Name:</Text>
                  <Text style={styles.formValue}>{userProfile.lastName}</Text>
                </View>
                
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Phone:</Text>
                  <Text style={styles.formValue}>{userProfile.phoneNumber}</Text>
                </View>
                
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Address:</Text>
                  <Text style={styles.formValue}>{userProfile.address}</Text>
                </View>
                
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Zip Code:</Text>
                  <Text style={styles.formValue}>{userProfile.zipCode}</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setAddressModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.updateButton]}
                    onPress={handleSelectAddress}
                  >
                    <Text style={[styles.buttonText, { color: COLORS.white }]}>Use This Address</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{alignItems: 'center', padding: 20}}>
                <Text>No address information found</Text>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, {marginTop: 20}]}
                  onPress={() => setAddressModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Voucher Modal */}
      <Modal
        visible={voucherModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVoucherModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Voucher</Text>
            
            <FlatList
              data={availableVouchers}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity 
                  style={styles.voucherItem}
                  onPress={() => handleSelectVoucher(item)}
                >
                  <View style={styles.voucherItemContent}>
                    <Icon name="local-offer" size={24} color={COLORS.primary} style={{marginRight: 15}} />
                    <View>
                      <Text style={styles.voucherItemCode}>{item.code}</Text>
                      <Text style={styles.voucherItemDesc}>{item.description}</Text>
                      <Text style={styles.voucherItemDiscount}>{item.discount}% off</Text>
                    </View>
                  </View>
                  {selectedVoucher?.id === item.id && (
                    <Icon name="check-circle" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.voucherSeparator} />}
              style={styles.voucherList}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setVoucherModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={() => setVoucherModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: COLORS.white }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment Method</Text>
            
            <View style={styles.paymentOptionsList}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    selectedPayment?.id === method.id && styles.selectedPaymentOption
                  ]}
                  onPress={() => handleSelectPayment(method)}
                >
                  <Icon 
                    name={method.icon} 
                    size={28} 
                    color={selectedPayment?.id === method.id ? COLORS.white : COLORS.primary}
                  />
                  <Text 
                    style={[
                      styles.paymentOptionText,
                      selectedPayment?.id === method.id && styles.selectedPaymentText
                    ]}
                  >
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.button, styles.fullWidthButton, styles.updateButton]}
              onPress={() => setPaymentModalVisible(false)}
            >
              <Text style={[styles.buttonText, { color: COLORS.white }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Checkout;