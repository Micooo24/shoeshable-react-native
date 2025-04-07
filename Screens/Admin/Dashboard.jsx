import React, { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Image,
  Animated,
  SafeAreaView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../Styles/admin'; 
import { COLORS } from '../../Theme/color'; 
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { getToken } from '../../sqlite_db/Auth'; // Import the getToken function

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const Dashboard = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const orderAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // State variables
  const [activeTab, setActiveTab] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Order data state
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    processingCount: 0,
    shippedCount: 0,
    confirmedCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
    avgOrderValue: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [revenueByDay, setRevenueByDay] = useState({});
  
  // Animation effect
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.stagger(100, [
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(orderAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ]).start();
  }, []);

  // Fetch order data
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Get authentication token
        const authData = await getToken();
        
        // Set up headers with auth token
        const headers = {};
        if (authData && authData.authToken) {
          headers.Authorization = `Bearer ${authData.authToken}`;
          console.log('Using auth token for API request');
        } else {
          console.log('No auth token found - proceeding with unauthenticated request');
        }
        
        // Make API request with auth headers
        const response = await axios.get(`${baseURL}/api/orders/all`, { headers });
        
        if (response.data && response.data.orders) {
          const orderData = response.data.orders;
          setOrders(orderData);
          
          // Calculate order statistics
          processOrderStats(orderData);
          
          // Find top selling products
          processTopProducts(orderData);
          
          // Process revenue data
          processRevenueData(orderData);
        }
      } catch (err) {
        console.error("Error fetching order data:", err.response?.status, err.message);
        
        // Provide more specific error messages based on HTTP status
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("You don't have permission to view this data.");
        } else {
          setError("Failed to load dashboard data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Process order statistics
  const processOrderStats = (orderData) => {
    const stats = {
      totalOrders: orderData.length,
      totalAmount: orderData.reduce((sum, order) => sum + order.totalPrice, 0),
      processingCount: 0,
      shippedCount: 0,
      confirmedCount: 0,
      deliveredCount: 0,
      cancelledCount: 0
    };
    
    // Count orders by status
    orderData.forEach(order => {
      switch (order.orderStatus) {
        case 'Processing':
          stats.processingCount++;
          break;
        case 'Shipped':
          stats.shippedCount++;
          break;
        case 'Confirmed':
          stats.confirmedCount++;
          break;
        case 'Delivered':
          stats.deliveredCount++;
          break;
        case 'Cancelled':
          stats.cancelledCount++;
          break;
      }
    });
    
    // Calculate average order value
    stats.avgOrderValue = stats.totalAmount / stats.totalOrders || 0;
    
    setOrderStats(stats);
  };

  // Process top products
  const processTopProducts = (orderData) => {
    // Create map to track product sales
    const productMap = {};
    
    // Process each order item
    orderData.forEach(order => {
      order.orderItems.forEach(item => {
        const { productId, productName, productImage, productPrice, quantity } = item;
        
        if (!productMap[productId]) {
          productMap[productId] = {
            id: productId,
            name: productName,
            image: productImage,
            totalSales: 0,
            totalQuantity: 0
          };
        }
        
        productMap[productId].totalSales += (productPrice * quantity);
        productMap[productId].totalQuantity += quantity;
      });
    });
    
    // Convert to array and sort by sales
    const topProductsList = Object.values(productMap)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);
      
    setTopProducts(topProductsList);
  };

  // Process revenue data for chart
  const processRevenueData = (orderData) => {
    const today = new Date();
    const revenueData = {};
    
    // Initialize last 7 days with zero revenue
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      revenueData[dateKey] = 0;
    }
    
    // Sum up order amounts by date
    orderData.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const dateKey = orderDate.toISOString().split('T')[0];
      
      // Only include orders from the last 7 days
      if (revenueData[dateKey] !== undefined) {
        revenueData[dateKey] += order.totalPrice;
      }
    });
    
    setRevenueByDay(revenueData);
  };

  const headerShadow = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [0, 10],
    extrapolate: 'clamp'
  });

  // Format revenue data for chart
  const getRevenueChartData = () => {
    const labels = Object.keys(revenueByDay).map(date => {
      const [year, month, day] = date.split('-');
      return `${month}/${day}`;
    });
    
    const data = Object.values(revenueByDay).map(value => value / 100); // Convert to currency unit
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₱${(amount / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Render widget item
  const renderWidget = (widget, index) => {
    const animDelay = index * 100;
    
    return (
      <Animated.View 
        key={widget.id} 
        style={[
          styles.widget, 
          isSmallDevice && styles.widgetSmall,
          { 
            transform: [{ 
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }],
            opacity: cardAnim
          }
        ]}
      >
        <LinearGradient
          colors={widget.gradient}
          style={styles.widgetGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.widgetContent}>
            <View style={styles.widgetLeft}>
              <Text style={styles.widgetTitle} numberOfLines={1}>{widget.title}</Text>
              <Text style={styles.widgetValue} numberOfLines={1}>{widget.value}</Text>
              <View style={styles.widgetChange}>
                <Ionicons 
                  name={widget.change?.startsWith('+') ? 'arrow-up' : 'arrow-down'} 
                  size={12} 
                  color={COLORS.white} 
                />
                <Text style={styles.changeText}>{widget.change}</Text>
              </View>
            </View>
            <View style={styles.widgetRight}>
              <View style={styles.iconCircle}>
                <MaterialIcons name={widget.icon} size={22} color={COLORS.white} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  // Generate widgets based on order stats
  const getWidgets = () => [
    { 
      id: 1, 
      title: 'Total Revenue', 
      value: formatCurrency(orderStats.totalAmount), 
      change: '+12.5%', // Historical data would go here
      icon: 'attach-money', 
      color: COLORS.success, 
      gradient: [COLORS.success, '#27ae60'],
      iconType: 'material'
    },
    { 
      id: 2, 
      title: 'Total Orders', 
      value: orderStats.totalOrders.toString(), 
      change: '+8.3%', 
      icon: 'shopping-bag', 
      color: COLORS.accent1, 
      gradient: [COLORS.accent1, '#2980b9'],
      iconType: 'material'
    },
    { 
      id: 3, 
      title: 'Delivered Orders', 
      value: orderStats.deliveredCount.toString(), 
      change: '+5.7%', 
      icon: 'check-circle', 
      color: COLORS.accent2, 
      gradient: [COLORS.accent2, '#16a085'],
      iconType: 'material'
    },
    { 
      id: 4, 
      title: 'Avg Order Value', 
      value: formatCurrency(orderStats.avgOrderValue), 
      change: '+2.3%', 
      icon: 'trending-up', 
      color: COLORS.warning, 
      gradient: [COLORS.warning, '#d35400'],
      iconType: 'material'
    },
  ];

  // Get recent orders for display
  const getRecentOrders = () => {
    return orders.slice(0, 4).map(order => ({
      id: order._id.slice(-6), // Show last 6 chars of order ID
      customer: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
      amount: formatCurrency(order.totalPrice),
      date: new Date(order.createdAt).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
      }),
      status: order.orderStatus
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return { bg: 'rgba(46, 204, 113, 0.15)', text: COLORS.success };
      case 'Processing': return { bg: 'rgba(52, 152, 219, 0.15)', text: COLORS.accent1 };
      case 'Confirmed': return { bg: 'rgba(241, 196, 15, 0.15)', text: COLORS.warning };
      case 'Shipped': return { bg: 'rgba(155, 89, 182, 0.15)', text: '#8e44ad' };
      case 'Cancelled': return { bg: 'rgba(231, 76, 60, 0.15)', text: COLORS.danger };
      default: return { bg: 'rgba(46, 204, 113, 0.15)', text: COLORS.success };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent />
      
      {/* Animated Header with Depth Effect */}
      <Animated.View
        style={[
          styles.header,
          {
            elevation: headerShadow,
            shadowOpacity: headerShadow.interpolate({
              inputRange: [0, 10],
              outputRange: [0.1, 0.3]
            }),
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }],
            opacity: headerAnim
          }
        ]}
      >
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity 
            onPress={() => navigation?.openDrawer()} 
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={24} color={COLORS.light} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Dashboard</Text>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.light} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{orderStats.processingCount}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.profileButton}
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }} 
                style={styles.headerProfileImage} 
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Main Content */}
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Welcome Message */}
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              transform: [{
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                })
              }],
              opacity: cardAnim
            }
          ]}
        >
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Admin</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.darkGrey} style={styles.calendarIcon} />
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
          </View>
        </Animated.View>
        
        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <Animated.View 
            style={[
              styles.statItem, 
              { 
                backgroundColor: 'rgba(52, 152, 219, 0.15)',
                transform: [{
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }],
                opacity: cardAnim
              }
            ]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: COLORS.accent }]}>
              <FontAwesome5 name="chart-line" size={14} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.statValue}>{formatCurrency(orderStats.totalAmount)}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.statItem, 
              { 
                backgroundColor: 'rgba(46, 204, 113, 0.15)',
                transform: [{
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }],
                opacity: cardAnim
              }
            ]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: COLORS.success }]}>
              <FontAwesome5 name="shipping-fast" size={14} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.statValue}>{orderStats.processingCount + orderStats.shippedCount}</Text>
              <Text style={styles.statLabel}>Active Orders</Text>
            </View>
          </Animated.View>
        </View>
        
        {/* Widgets Container - Enhanced with Staggered Animation */}
        <View style={styles.widgetsContainer}>
          {getWidgets().map((widget, index) => renderWidget(widget, index))}
        </View>
        
        {/* Order Status Breakdown */}
        <Animated.View 
          style={[
            styles.chartContainer,
            {
              transform: [{
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0]
                })
              }],
              opacity: cardAnim
            }
          ]}
        >
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Order Status</Text>
          </View>
          
          <View style={styles.orderStatusContainer}>
            <View style={styles.orderStatusItem}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.accent1 }]} />
              <Text style={styles.statusLabel}>Processing</Text>
              <Text style={styles.statusCount}>{orderStats.processingCount}</Text>
            </View>
            
            <View style={styles.orderStatusItem}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.statusLabel}>Confirmed</Text>
              <Text style={styles.statusCount}>{orderStats.confirmedCount}</Text>
            </View>
            
            <View style={styles.orderStatusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#8e44ad' }]} />
              <Text style={styles.statusLabel}>Shipped</Text>
              <Text style={styles.statusCount}>{orderStats.shippedCount}</Text>
            </View>
            
            <View style={styles.orderStatusItem}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.statusLabel}>Delivered</Text>
              <Text style={styles.statusCount}>{orderStats.deliveredCount}</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Revenue Chart with Enhanced Design */}
        <Animated.View 
          style={[
            styles.chartContainer,
            {
              transform: [{
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0]
                })
              }],
              opacity: cardAnim
            }
          ]}
        >
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue (Last 7 Days)</Text>
          </View>
          
          <View style={styles.chartWrapper}>
            <LineChart
              data={getRevenueChartData()}
              width={width - 48}
              height={220}
              chartConfig={{
                backgroundColor: COLORS.white,
                backgroundGradientFrom: COLORS.white,
                backgroundGradientTo: COLORS.white,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(127, 140, 141, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: COLORS.primary
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: 'rgba(189, 195, 199, 0.4)',
                  strokeWidth: 1
                },
                formatYLabel: (value) => `₱${parseInt(value).toLocaleString()}`,
                fillShadowGradientFrom: COLORS.accent,
                fillShadowGradientTo: COLORS.white,
                fillShadowGradientOpacity: 0.2,
                useShadowColorFromDataset: false
              }}
              bezier
              style={styles.chart}
              withShadow={false}
              withVerticalLines={true}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
              segments={5}
            />
          </View>
        </Animated.View>
        
        {/* Recent Orders with Enhanced Animation */}
        <Animated.View 
          style={[
            styles.ordersContainer, 
            { 
              opacity: orderAnim, 
              transform: [{ 
                translateY: orderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                })
              }]
            }
          ]}
        >
          <View style={styles.ordersHeader}>
            <Text style={styles.ordersTitle}>Recent Orders</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialIcons name="chevron-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          {getRecentOrders().map((order, index) => (
            <TouchableOpacity 
              key={order.id} 
              style={[
                styles.orderCard,
                index === getRecentOrders().length - 1 && styles.lastOrderCard
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
            >
              <View style={styles.orderLeft}>
                <View style={[
                  styles.orderIconContainer,
                  { backgroundColor: getStatusColor(order.status).bg }
                ]}>
                  <MaterialIcons 
                    name={
                      order.status === 'Delivered' ? 'check-circle' : 
                      order.status === 'Processing' ? 'hourglass-empty' : 
                      order.status === 'Shipped' ? 'local-shipping' :
                      order.status === 'Confirmed' ? 'thumb-up' : 'cancel'
                    } 
                    size={18} 
                    color={getStatusColor(order.status).text} 
                  />
                </View>
              </View>
              
              <View style={styles.orderInfo}>
                <Text style={styles.orderId} numberOfLines={1}>#{order.id}</Text>
                <Text style={styles.orderCustomer} numberOfLines={1}>{order.customer}</Text>
                <Text style={styles.orderDate} numberOfLines={1}>{order.date}</Text>
              </View>
              
              <View style={styles.orderDetails}>
                <Text style={styles.orderAmount}>{order.amount}</Text>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusColor(order.status).bg }
                ]}>
                  <Text style={[
                    styles.statusText, 
                    { color: getStatusColor(order.status).text }
                  ]}>
                    {order.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.seeMoreButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.seeMoreText}>See More Orders</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Top Products */}
        <Animated.View 
          style={[
            styles.statCard, 
            { 
              transform: [{ 
                translateY: orderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }],
              opacity: orderAnim
            }
          ]}
        >
          <View style={styles.statCardHeader}>
            <Text style={styles.statCardTitle}>Top Selling Shoes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <MaterialIcons name="arrow-forward-ios" size={14} color={COLORS.darkGrey} />
            </TouchableOpacity>
          </View>
          
          {topProducts.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <View style={[styles.productIconContainer, { backgroundColor: 'rgba(52, 152, 219, 0.15)' }]}>
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.productImage} 
                  resizeMode="contain"
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productStats}>{product.totalQuantity} pairs sold</Text>
              </View>
              <Text style={styles.productAmount}>{formatCurrency(product.totalSales)}</Text>
            </View>
          ))}

          {topProducts.length === 0 && (
            <Text style={styles.noDataText}>No product sales data available</Text>
          )}
        </Animated.View>
        
        {/* Payment Method Distribution */}
        <Animated.View 
          style={[
            styles.statCard, 
            { 
              transform: [{ 
                translateY: orderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }],
              opacity: orderAnim
            }
          ]}
        >
          <View style={styles.statCardHeader}>
            <Text style={styles.statCardTitle}>Payment Methods</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color={COLORS.darkGrey} />
          </View>
          
          <View style={styles.channelContainer}>
            {calculatePaymentMethods().map((method, index) => (
              <View key={index} style={styles.channelItem}>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelLabel}>{method.name}</Text>
                  <Text style={styles.channelValue}>{method.percentage}%</Text>
                </View>
                <View style={styles.progressBackground}>
                  <View style={[styles.progressFill, { 
                    width: `${method.percentage}%`, 
                    backgroundColor: method.color 
                  }]} />
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
      
      {/* Floating Action Button */}
      <Animated.View 
        style={[
          styles.fab,
          {
            transform: [{ 
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.fabButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreateProduct')}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
  
  function calculatePaymentMethods() {
    const methods = {};
    let total = 0;
    
    orders.forEach(order => {
      const method = order.paymentInfo.method;
      if (!methods[method]) {
        methods[method] = 0;
      }
      methods[method]++;
      total++;
    });
    
    const colors = [COLORS.accent1, COLORS.success, COLORS.warning, '#8e44ad'];
    
    return Object.entries(methods).map(([name, count], index) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
      color: colors[index % colors.length]
    }));
  }
};

export default Dashboard;
