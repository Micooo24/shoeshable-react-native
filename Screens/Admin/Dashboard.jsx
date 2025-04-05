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
  Platform
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../Styles/admin'; 
import { COLORS } from '../../Theme/color'; 

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
  
  // Enhanced animations with staggered effect
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

  // Header shadow animation based on scroll position
  const headerShadow = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [0, 10],
    extrapolate: 'clamp'
  });

  // Sample data for charts with smoother values
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [25, 42, 38, 56, 68, 63],
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: [18, 32, 28, 42, 53, 48],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
        withDots: false
      }
    ]
  };

  // Widget data with more descriptive metrics
  const widgets = [
    { 
      id: 1, 
      title: 'Total Revenue', 
      value: '$24,500', 
      change: '+12.5%', 
      icon: 'attach-money', 
      color: COLORS.success, 
      gradient: [COLORS.success, '#27ae60'],
      iconType: 'material'
    },
    { 
      id: 2, 
      title: 'Total Orders', 
      value: '1,240', 
      change: '+8.3%', 
      icon: 'shopping-bag', 
      color: COLORS.accent1, 
      gradient: [COLORS.accent1, '#2980b9'],
      iconType: 'material'
    },
    { 
      id: 3, 
      title: 'New Customers', 
      value: '254', 
      change: '+5.7%', 
      icon: 'person-add', 
      color: COLORS.accent2, 
      gradient: [COLORS.accent2, '#16a085'],
      iconType: 'material'
    },
    { 
      id: 4, 
      title: 'Conversion Rate', 
      value: '12.5%', 
      change: '+2.3%', 
      icon: 'trending-up', 
      color: COLORS.warning, 
      gradient: [COLORS.warning, '#d35400'],
      iconType: 'material'
    },
  ];

  // Recent orders data
  const recentOrders = [
    { id: '#ORD-001', customer: 'Emma Wilson', amount: '$120.00', date: 'Today, 10:45 AM', status: 'Completed' },
    { id: '#ORD-002', customer: 'Michael Johnson', amount: '$350.50', date: 'Today, 09:12 AM', status: 'Processing' },
    { id: '#ORD-003', customer: 'Sophia Davis', amount: '$75.20', date: 'Yesterday, 03:45 PM', status: 'Completed' },
    { id: '#ORD-004', customer: 'James Miller', amount: '$220.00', date: 'Yesterday, 01:30 PM', status: 'Cancelled' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return { bg: 'rgba(46, 204, 113, 0.15)', text: COLORS.success };
      case 'Processing': return { bg: 'rgba(52, 152, 219, 0.15)', text: COLORS.accent1 };
      case 'Cancelled': return { bg: 'rgba(231, 76, 60, 0.15)', text: COLORS.danger };
      default: return { bg: 'rgba(46, 204, 113, 0.15)', text: COLORS.success };
    }
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
                  name={widget.change.startsWith('+') ? 'arrow-up' : 'arrow-down'} 
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
                <Text style={styles.badgeText}>3</Text>
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
              <Text style={styles.statValue}>$8,450</Text>
              <Text style={styles.statLabel}>Today's Sales</Text>
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
              <FontAwesome5 name="shopping-cart" size={14} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>Today's Orders</Text>
            </View>
          </Animated.View>
        </View>
        
        {/* Widgets Container - Enhanced with Staggered Animation */}
        <View style={styles.widgetsContainer}>
          {widgets.map((widget, index) => renderWidget(widget, index))}
        </View>
        
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
            <Text style={styles.chartTitle}>Revenue Overview</Text>
            <View style={styles.chartTabs}>
              <TouchableOpacity 
                style={[styles.chartTab, activeTab === 'day' && styles.chartTabActive]}
                onPress={() => setActiveTab('day')}
                activeOpacity={0.7}
              >
                <Text style={[styles.chartTabText, activeTab === 'day' && styles.chartTabTextActive]}>Day</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.chartTab, activeTab === 'week' && styles.chartTabActive]}
                onPress={() => setActiveTab('week')}
                activeOpacity={0.7}
              >
                <Text style={[styles.chartTabText, activeTab === 'week' && styles.chartTabTextActive]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.chartTab, activeTab === 'month' && styles.chartTabActive]}
                onPress={() => setActiveTab('month')}
                activeOpacity={0.7}
              >
                <Text style={[styles.chartTabText, activeTab === 'month' && styles.chartTabTextActive]}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.chartWrapper}>
            <LineChart
              data={revenueData}
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
          
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
              <Text style={styles.legendText}>Revenue</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.legendText}>Profit</Text>
            </View>
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
            >
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialIcons name="chevron-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          {recentOrders.map((order, index) => (
            <TouchableOpacity 
              key={order.id} 
              style={[
                styles.orderCard,
                index === recentOrders.length - 1 && styles.lastOrderCard
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.orderLeft}>
                <View style={[
                  styles.orderIconContainer,
                  { backgroundColor: getStatusColor(order.status).bg }
                ]}>
                  <MaterialIcons 
                    name={
                      order.status === 'Completed' ? 'check-circle' : 
                      order.status === 'Processing' ? 'hourglass-empty' : 'cancel'
                    } 
                    size={18} 
                    color={getStatusColor(order.status).text} 
                  />
                </View>
              </View>
              
              <View style={styles.orderInfo}>
                <Text style={styles.orderId} numberOfLines={1}>{order.id}</Text>
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
          >
            <Text style={styles.seeMoreText}>See More Orders</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Additional Stats Cards */}
        <View style={styles.additionalStatsContainer}>
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
              <Text style={styles.statCardTitle}>Top Products</Text>
              <MaterialIcons name="arrow-forward-ios" size={14} color={COLORS.darkGrey} />
            </View>
            
            <View style={styles.productItem}>
              <View style={[styles.productIconContainer, { backgroundColor: 'rgba(52, 152, 219, 0.15)' }]}>
                <MaterialIcons name="smartphone" size={18} color={COLORS.accent} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>iPhone Pro Max</Text>
                <Text style={styles.productStats}>432 sales</Text>
              </View>
              <Text style={styles.productAmount}>$12,540</Text>
            </View>
            
            <View style={styles.productItem}>
              <View style={[styles.productIconContainer, { backgroundColor: 'rgba(46, 204, 113, 0.15)' }]}>
                <MaterialIcons name="laptop" size={18} color={COLORS.success} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>MacBook Pro</Text>
                <Text style={styles.productStats}>327 sales</Text>
              </View>
              <Text style={styles.productAmount}>$8,635</Text>
            </View>
          </Animated.View>
          
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
              <Text style={styles.statCardTitle}>Sales Channels</Text>
              <MaterialIcons name="arrow-forward-ios" size={14} color={COLORS.darkGrey} />
            </View>
            
            <View style={styles.channelContainer}>
              <View style={styles.channelItem}>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelLabel}>Online Store</Text>
                  <Text style={styles.channelValue}>68%</Text>
                </View>
                <View style={styles.progressBackground}>
                  <View style={[styles.progressFill, { width: '68%', backgroundColor: COLORS.accent }]} />
                </View>
              </View>
              
              <View style={styles.channelItem}>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelLabel}>Retail Store</Text>
                  <Text style={styles.channelValue}>24%</Text>
                </View>
                <View style={styles.progressBackground}>
                  <View style={[styles.progressFill, { width: '24%', backgroundColor: COLORS.success }]} />
                </View>
              </View>
              
              <View style={styles.channelItem}>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelLabel}>Other</Text>
                  <Text style={styles.channelValue}>8%</Text>
                </View>
                <View style={styles.progressBackground}>
                  <View style={[styles.progressFill, { width: '8%', backgroundColor: COLORS.warning }]} />
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
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
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Dashboard;