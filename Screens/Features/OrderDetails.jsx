import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { getToken } from '../../sqlite_db/Auth'; // Make sure path is correct

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Processing': return '#FFA500';
      case 'Confirmed': return '#3498db';
      case 'Shipped': return '#9b59b6';
      case 'Delivered': return '#2ecc71';
      case 'Cancelled': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const OrderDetails = ({ navigation }) => {
  const route = useRoute();
  const { orderId } = route.params;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Get authentication when component mounts
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const auth = await getToken();
        if (auth && auth.authToken) {
          setAuthToken(auth.authToken);
          console.log("User authenticated, fetching order");
        } else {
          console.log("No authentication found");
          setError("Please log in to view order details");
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication error");
      }
    };
    
    loadAuth();
  }, []);

  // Fetch order details when auth is loaded
  useEffect(() => {
    if (authToken) {
      fetchOrderDetails();
    }
  }, [authToken]);

  const fetchOrderDetails = async () => {
    if (!authToken) {
      console.log("Cannot fetch orders without authentication");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/orders/myorder/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError('Failed to retrieve order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      
      if (err.response) {
        if (err.response.status === 401) {
          setError('Your session has expired. Please login again.');
        } else if (err.response.status === 403) {
          setError('You do not have permission to view this order');
        } else {
          setError(`Error: ${err.response.data?.message || 'Could not fetch order'}`);
        }
      } else {
        setError('Network error while fetching order details');
      }
    } finally {
      setLoading(false);
    }
  };

  // Keep using moment.js for date formatting as requested
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY h:mm A');
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Icon name="alert-circle-outline" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centeredContainer}>
        <Icon name="package-variant-closed" size={60} color="#7f8c8d" />
        <Text style={styles.noDataText}>No order information available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Order Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>{order._id}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <OrderStatusBadge status={order.orderStatus} />
      </View>

      {/* Shipping Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color="#1976D2" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {order.shippingInfo.firstName} {order.shippingInfo.lastName}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#1976D2" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {order.shippingInfo.address}, {order.shippingInfo.zipCode}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#1976D2" style={styles.infoIcon} />
            <Text style={styles.infoText}>{order.shippingInfo.phoneNumber}</Text>
          </View>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon 
              name={order.paymentInfo.method === 'Cash on Delivery' ? 'cash' : 'credit-card'}
              size={20} 
              color="#1976D2" 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoText}>{order.paymentInfo.method}</Text>
          </View>
          
          {order.paidAt && (
            <View style={styles.infoRow}>
              <Icon name="calendar-check" size={20} color="#1976D2" style={styles.infoIcon} />
              <Text style={styles.infoText}>Paid on {formatDate(order.paidAt)}</Text>
            </View>
          )}
          
          {order.deliveredAt && (
            <View style={styles.infoRow}>
              <Icon name="truck-delivery" size={20} color="#1976D2" style={styles.infoIcon} />
              <Text style={styles.infoText}>Delivered on {formatDate(order.deliveredAt)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.orderItems.map(item => (
          <View key={item._id} style={styles.productCard}>
            <Image 
              source={{ uri: item.productImage }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.productName}</Text>
              <View style={styles.productDetails}>
                <Text style={styles.productDetailText}>Size: {item.size}</Text>
                <Text style={styles.productDetailText}>Color: {item.color}</Text>
              </View>
              <View style={styles.productPriceContainer}>
                <Text style={styles.productQuantity}>{item.quantity} x</Text>
                <Text style={styles.productPrice}>₱{item.productPrice.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Price Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₱{order.subtotal.toLocaleString()}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee</Text>
            <Text style={styles.priceValue}>₱{order.shippingFee.toLocaleString()}</Text>
          </View>
          
          {order.voucher && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Discount <Text style={styles.voucherCode}>({order.voucher.code})</Text>
              </Text>
              <Text style={styles.discountValue}>-₱{order.discountAmount.toLocaleString()}</Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₱{order.totalPrice.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  // Your existing styles...
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1976D2',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  productDetailText: {
    fontSize: 13,
    color: '#7f8c8d',
    marginRight: 10,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productQuantity: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 5,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  voucherCode: {
    color: '#1976D2',
    fontStyle: 'italic',
  },
  discountValue: {
    fontSize: 14,
    color: '#2ecc71',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  }
});

export default OrderDetails;