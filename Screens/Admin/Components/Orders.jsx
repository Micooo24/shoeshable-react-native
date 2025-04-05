import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Image
} from 'react-native';
import axios from 'axios';
import baseURL from '../../../assets/common/baseurl';
import { getToken } from '../../../sqlite_db/Auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../../Theme/color';
import { styles } from '../../../Styles/order';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  
  const statusOptions = ['All', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  
  // Format date function (local implementation)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency function (local implementation)
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₱0';
    return `₱${amount.toLocaleString()}`;
  };
  
  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const tokenData = await getToken();
      
      if (!tokenData || !tokenData.authToken) {
        Alert.alert('Error', 'You are not authenticated');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${baseURL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${tokenData.authToken}`
        }
      });
      
      console.log('Orders API Response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalAmount(response.data.totalAmount);
        setOrderCount(response.data.count);
      } else {
        Alert.alert('Error', 'Failed to fetch orders');
      }
      
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', error.message || 'An error occurred while fetching orders');
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };
  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const tokenData = await getToken();
      
      // Add a field to control notifications (optional)
      const response = await axios.put(`${baseURL}/api/orders/update/${orderId}`, 
        { 
          status: newStatus,
          orderStatus: newStatus,
          sendNotification: true // Flag to control notification sending
        },
        {
          headers: {
            Authorization: `Bearer ${tokenData.authToken}`
          }
        }
      );
      
      // Rest of your code remains the same
    } catch (error) {
      // Enhanced error logging
      console.error('Error updating order status:', error);
      console.log('Error response data:', error.response?.data);
      
      // Show different message if it's a notification error
      const isNotificationError = error.response?.data?.notificationError;
      const errorMsg = isNotificationError 
        ? `Order status updated but notification failed: ${error.response?.data?.message || error.message}`
        : error.response?.data?.message || error.message || 'An error occurred while updating order status';
      
      Alert.alert(isNotificationError ? 'Partial Success' : 'Error', errorMsg);
      setLoading(false);
    }
  };
  
  // Filter orders by status
  const getFilteredOrders = () => {
    if (statusFilter === 'All') {
      return orders;
    }
    return orders.filter(order => order.orderStatus === statusFilter);
  };
  
  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  // Render order item
  const renderOrderItem = ({ item }) => {
    // Calculate total items in order
    const totalItems = item.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => viewOrderDetails(item)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>#ORD-{item._id.substring(item._id.length - 8)}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.orderStatus).background }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: getStatusColor(item.orderStatus).text }
            ]}>
              {item.orderStatus}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderBody}>
          <View style={styles.customerInfo}>
            <Icon name="account" size={16} color={COLORS.primary} />
            <Text style={styles.customerName}>
              {item.shippingInfo.firstName} {item.shippingInfo.lastName}
            </Text>
            <Icon name="phone" size={16} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.customerPhone}>{item.shippingInfo.phoneNumber}</Text>
          </View>
          
          <View style={styles.orderSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Items:</Text>
              <Text style={styles.summaryValue}>{totalItems} {totalItems > 1 ? 'products' : 'product'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Payment:</Text>
              <Text style={styles.summaryValue}>{item.paymentInfo.method}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>₱{item.totalPrice?.toLocaleString()}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.orderFooter}>
          <Icon name="chevron-right" size={24} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
    );
  };
  
  // Order details modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;
    
    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Order ID and Date */}
              <View style={styles.detailsCard}>
                <Text style={styles.detailsCardTitle}>Order Information</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Order ID:</Text>
                  <Text style={styles.detailsValue}>
                    #{selectedOrder._id.substring(selectedOrder._id.length - 8)}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Date:</Text>
                  <Text style={styles.detailsValue}>
                    {formatDate(selectedOrder.createdAt)}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Status:</Text>
                  <View style={[
                    styles.detailsStatusBadge,
                    { backgroundColor: getStatusColor(selectedOrder.orderStatus).background }
                  ]}>
                    <Text style={[
                      styles.detailsStatusText,
                      { color: getStatusColor(selectedOrder.orderStatus).text }
                    ]}>
                      {selectedOrder.orderStatus}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Customer Information */}
              <View style={styles.detailsCard}>
                <Text style={styles.detailsCardTitle}>Customer Information</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Name:</Text>
                  <Text style={styles.detailsValue}>
                    {selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Email:</Text>
                  <Text style={styles.detailsValue}>
                    {selectedOrder.user.email}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Phone:</Text>
                  <Text style={styles.detailsValue}>
                    {selectedOrder.shippingInfo.phoneNumber}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Address:</Text>
                  <Text style={styles.detailsValue}>
                    {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.zipCode}
                  </Text>
                </View>
              </View>
              
              {/* Order Items */}
              <View style={styles.detailsCard}>
                <Text style={styles.detailsCardTitle}>Order Items</Text>
                {selectedOrder.orderItems.map((item, index) => (
                  <View key={index} style={styles.orderItemCard}>
                    <Image 
                      source={{ uri: item.productImage }} 
                      style={styles.productImage}
                    />
                    <View style={styles.productDetails}>
                      <Text style={styles.productName}>{item.productName}</Text>
                      <Text style={styles.productVariants}>
                        Size: {item.size} | Color: {item.color}
                      </Text>
                      <View style={styles.productPriceRow}>
                        <Text style={styles.productPrice}>
                          ₱{item.productPrice?.toLocaleString()}
                        </Text>
                        <Text style={styles.productQuantity}>x{item.quantity}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              
              {/* Payment Details */}
              <View style={styles.detailsCard}>
                <Text style={styles.detailsCardTitle}>Payment Details</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Method:</Text>
                  <Text style={styles.detailsValue}>
                    {selectedOrder.paymentInfo.method}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Subtotal:</Text>
                  <Text style={styles.detailsValue}>
                    ₱{selectedOrder.subtotal?.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Shipping Fee:</Text>
                  <Text style={styles.detailsValue}>
                    ₱{selectedOrder.shippingFee?.toLocaleString()}
                  </Text>
                </View>
                {selectedOrder.voucher && (
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Discount:</Text>
                    <Text style={styles.discountValue}>
                      -₱{selectedOrder.discountAmount?.toLocaleString()} ({selectedOrder.voucher.code})
                    </Text>
                  </View>
                )}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    ₱{selectedOrder.totalPrice?.toLocaleString()}
                  </Text>
                </View>
              </View>
              
              {/* Update Status */}
              <View style={styles.detailsCard}>
                <Text style={styles.detailsCardTitle}>Update Order Status</Text>
                <View style={styles.statusPickerContainer}>
                  <Picker
                    selectedValue={selectedOrder.orderStatus}
                    style={styles.statusPicker}
                    onValueChange={(itemValue) => {
                      setSelectedOrder({...selectedOrder, orderStatus: itemValue});
                    }}
                  >
                    {statusOptions.filter(option => option !== 'All').map((status, index) => (
                      <Picker.Item key={index} label={status} value={status} />
                    ))}
                  </Picker>
                </View>
                <TouchableOpacity 
                  style={styles.updateButton}
                  onPress={() => updateOrderStatus(selectedOrder._id, selectedOrder.orderStatus)}
                >
                  <Text style={styles.updateButtonText}>Update Status</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  
  // Helper function to get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return { background: '#FFF4DE', text: '#FFA940' };
      case 'Confirmed':
        return { background: '#E6F7FF', text: '#1890FF' };
      case 'Shipped':
        return { background: '#E6FFFB', text: '#13C2C2' };
      case 'Delivered':
        return { background: '#F6FFED', text: '#52C41A' };
      case 'Cancelled':
        return { background: '#FFF1F0', text: '#FF4D4F' };
      default:
        return { background: '#F5F5F5', text: '#8C8C8C' };
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header with stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{orderCount}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₱{totalAmount?.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>
      
      {/* Filter bar */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Status:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={statusFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setStatusFilter(itemValue)}
          >
            {statusOptions.map((status, index) => (
              <Picker.Item key={index} label={status} value={status} />
            ))}
          </Picker>
        </View>
      </View>
      
      {/* Orders list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="basket-off" size={64} color={COLORS.primaryLight} />
              <Text style={styles.emptyText}>No orders found</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* Order details modal */}
      <OrderDetailsModal />
    </View>
  );
};

export default Order;
