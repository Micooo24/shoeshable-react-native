import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../Styles/profile';

const OrdersScreen = ({ route, navigation }) => {
  const { status } = route.params || {};
  const { orders, loading } = useSelector(state => state.orderData);
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  // Status mappings for UI display
  const statusMappings = {
    'processing': { title: 'To Pay', icon: 'credit-card-outline', color: COLORS.warning },
    'confirmed': { title: 'To Ship', icon: 'package-variant-closed', color: COLORS.info },
    'shipped': { title: 'To Deliver', icon: 'truck-delivery-outline', color: COLORS.accent },
    'delivered': { title: 'To Rate', icon: 'star-outline', color: COLORS.success }
  };
  
  useEffect(() => {
    // Filter orders based on the status parameter if provided
    if (status && orders.length > 0) {
      // Special filter for "To Rate" - delivered orders that aren't rated yet
      if (status === 'delivered') {
        setFilteredOrders(orders.filter(order => 
          order.status === status && !order.isRated
        ));
      } else {
        setFilteredOrders(orders.filter(order => order.status === status));
      }
    } else {
      // If no status provided or if we want to show all orders
      setFilteredOrders(orders);
    }
  }, [status, orders]);
  
  const renderOrderItem = ({ item }) => {
    const statusInfo = statusMappings[item.status] || { 
      title: 'Unknown', 
      icon: 'help-circle-outline',
      color: COLORS.text
    };
    
    // Format date
    const orderDate = new Date(item.createdAt);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Calculate total price
    const totalPrice = item.totalPrice || item.orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
    
    return (
      <TouchableOpacity 
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item._id })}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order #</Text>
            <Text style={styles.orderId}>{item._id.substring(item._id.length - 6).toUpperCase()}</Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: `${statusInfo.color}20` }]}>
            <Icon name={statusInfo.icon} size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.title}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderDetails}>
          <View style={styles.itemPreview}>
            {item.orderItems && item.orderItems.length > 0 ? (
              <FlatList
                data={item.orderItems.slice(0, 3)} // Show max 3 items
                horizontal
                renderItem={({ item: orderItem }) => (
                  <View style={styles.itemImageContainer}>
                    <Image
                      source={{ 
                        uri: orderItem.product?.images?.[0]?.url || 'https://via.placeholder.com/100'
                      }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                    <View style={styles.itemCountBadge}>
                      <Text style={styles.itemCountText}>{orderItem.quantity}</Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => `${item._id || index}`}
              />
            ) : (
              <Text style={styles.noItemsText}>No items</Text>
            )}
            
            {item.orderItems && item.orderItems.length > 3 && (
              <View style={styles.moreItemsBadge}>
                <Text style={styles.moreItemsText}>+{item.orderItems.length - 3}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.orderFooter}>
            <Text style={styles.orderDate}>{formattedDate}</Text>
            <Text style={styles.orderTotal}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {status ? statusMappings[status]?.title || 'Orders' : 'All Orders'}
        </Text>
        <View style={styles.backButton} />
      </View>
      
      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="package-variant" size={60} color={`${COLORS.text}30`} />
          <Text style={styles.emptyText}>No orders found</Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopNowButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 24,
  },
  shopNowButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContainer: {
    padding: 12,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginRight: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  itemPreview: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImageContainer: {
    position: 'relative',
    marginRight: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemCountBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  itemCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  moreItemsBadge: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  noItemsText: {
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
});

export default OrdersScreen;