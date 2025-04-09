import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { getToken } from '../../sqlite_db/Auth';
import { COLORS } from '../../Theme/color';

const { width } = Dimensions.get('window');

const Orders = ({ route, navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get status from route params or set default to show all orders
  const statusFilter = route.params?.status || null;
  
  // Title mapping based on status
  const statusTitles = {
    'processing': 'To Pay',
    'confirmed': 'To Ship',
    'shipped': 'To Deliver',
    'delivered': 'To Rate',
    null: 'All Orders'
  };
  
  const pageTitle = statusTitles[statusFilter] || 'Orders';
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const tokenData = await getToken();
      if (!tokenData || !tokenData.authToken) {
        Alert.alert("Authentication Required", "Please log in to view your orders");
        navigation.navigate("Profile");
        return;
      }
      
      const response = await axios.get(
        `${baseURL}/api/users/orders`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.authToken}`
          }
        }
      );
      
      if (response.status === 200 && response.data.success) {
        // Filter orders if a status filter is provided
        let filteredOrders = response.data.orders || [];
        
        if (statusFilter) {
          filteredOrders = filteredOrders.filter(order => 
            order.orderStatus.toLowerCase() === statusFilter.toLowerCase()
          );
        }
        
        setOrders(filteredOrders);
      } else {
        Alert.alert("Error", "Unable to fetch your orders. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Connection Error", "Unable to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  
  // Get status badge colors
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return COLORS.success;
      case 'shipped':
        return COLORS.warning;
      case 'confirmed':
        return COLORS.accent;
      case 'processing':
        return COLORS.primary;
      default:
        return COLORS.darkGrey;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'package-variant-delivered';
      case 'shipped':
        return 'truck-delivery';
      case 'confirmed':
        return 'check-circle-outline';
      case 'processing':
        return 'credit-card-outline';
      default:
        return 'information-outline';
    }
  };
  
  // Handle cancel order
  const handleCancelOrder = (orderId) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive", 
          onPress: async () => {
            try {
              // Implement your cancel order API call here
              const tokenData = await getToken();
              
              const response = await axios.put(
                `${baseURL}/api/orders/${orderId}/cancel`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${tokenData.authToken}`
                  }
                }
              );
              
              if (response.status === 200) {
                Alert.alert("Success", "Order cancelled successfully");
                fetchOrders(); // Refresh orders list
              } else {
                Alert.alert("Error", "Failed to cancel order");
              }
            } catch (error) {
              console.error("Cancel order error:", error);
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          } 
        }
      ]
    );
  };
  
  const renderOrderItem = ({ item }) => {
    const showCancelButton = item.orderStatus.toLowerCase() === 'processing';
    const statusColor = getStatusColor(item.orderStatus);
    const statusLightColor = `${statusColor}20`; // 20% opacity version of color
    
    // Make sure all text is wrapped in Text components
    const itemCountText = `${item.orderItems?.length || 0} ${item.orderItems?.length === 1 ? 'item' : 'items'}`;
    const totalAmountText = `$${(item.totalPrice || 0).toFixed(2)}`;
    const orderIdText = `Order #${item._id.slice(-6)}`;
    
    return (
      <View style={styles.orderItem}>
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>{orderIdText}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
              <Icon 
                name={getStatusIcon(item.orderStatus)} 
                size={14} 
                color={statusColor} 
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.orderStatus}
              </Text>
            </View>
          </View>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        </View>
        
        <View style={styles.orderSummary}>
          <View style={[styles.orderIconContainer, { backgroundColor: statusLightColor }]}>
            <Icon name={getStatusIcon(item.orderStatus)} size={24} color={statusColor} />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.itemCount}>{itemCountText}</Text>
            <Text style={styles.totalAmount}>{totalAmountText}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => navigation.navigate("OrderDetails", { orderId: item._id })}
          >
            <Text style={styles.detailButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };
  
  useEffect(() => {
    fetchOrders();
    
    // We'll keep this for compatibility, but add our own header
    navigation.setOptions({
      headerShown: false
    });
  }, [statusFilter]);
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="package-variant" size={60} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>No Orders Found</Text>
      <Text style={styles.emptyText}>
        You haven't placed any orders yet. Start shopping to see your orders here.
      </Text>
      <TouchableOpacity 
        style={styles.shopButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.shopButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Prepare the loading state content
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading your orders...</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: COLORS.categoryBackground}]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.headerBackground} />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Profile')}
          hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
        >
          <Icon name="arrow-left" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pageTitle}</Text>
        <View style={{width: 40}} />
      </View>
      
      {loading && !refreshing ? renderLoadingState() : (
        orders.length > 0 ? (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.ordersList}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.categoryBackground,
  },
  // New header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.headerBackground,
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 33,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  // Your existing styles...
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  ordersList: {
    padding: 16,
    paddingBottom: 24,
  },
  orderItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 0,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  orderSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  itemCount: {
    fontSize: 15,
    marginBottom: 4,
    color: COLORS.text,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    elevation: 1,
  },
  detailButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  cancelButtonText: {
    color: COLORS.danger,
    fontWeight: '600',
    fontSize: 15,
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2,
  },
  shopButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  }
});

export default Orders;