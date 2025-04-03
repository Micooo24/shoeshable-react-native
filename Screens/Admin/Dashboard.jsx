// import React, { useState, useEffect } from 'react';
// import { 
//   StyleSheet, 
//   Text, 
//   View, 
//   TouchableOpacity, 
//   ScrollView, 
//   Dimensions, 
//   StatusBar,
//   Image,
//   Animated
// } from 'react-native';
// import { 
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem
// } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import { LineChart } from 'react-native-chart-kit';
// import { LinearGradient } from 'expo-linear-gradient';

// // Get screen dimensions
// const { width } = Dimensions.get('window');

// // Custom Drawer Content Component
// const CustomDrawerContent = (props) => {
//   return (
//     <DrawerContentScrollView 
//       {...props} 
//       style={styles.drawerContent}
//       contentContainerStyle={styles.drawerContentContainer}
//     >
//       <LinearGradient
//         colors={['#2A45C2', '#1565C0']}
//         style={styles.drawerHeader}
//       >
//         <View style={styles.userInfoSection}>
//           <View style={styles.profileImageContainer}>
//             <Image 
//               source={{ uri: 'https://i.pravatar.cc/150?img=12' }} 
//               style={styles.profileImage} 
//             />
//           </View>
//           <View style={styles.userDetails}>
//             <Text style={styles.userDisplayName}>John Anderson</Text>
//             <View style={styles.userRoleContainer}>
//               <Text style={styles.userRole}>Administrator</Text>
//             </View>
//           </View>
//         </View>
//       </LinearGradient>
//       <View style={styles.drawerItems}>
//         <DrawerItemList {...props} />
//       </View>
//       <View style={styles.drawerLine} />
//       <DrawerItem 
//         label="Logout" 
//         icon={({color, size}) => <MaterialIcons name="logout" color="#FF5252" size={size} />}
//         onPress={() => alert('Logout')}
//         labelStyle={styles.logoutLabel}
//       />
//       <View style={styles.drawerFooter}>
//         <Text style={styles.versionText}>Version 1.0.0</Text>
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// // Dashboard Screen Component
// const DashboardScreen = ({ navigation }) => {
//   // Animation values
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [slideAnim] = useState(new Animated.Value(20));
  
//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       })
//     ]).start();
//   }, []);

//   // Sample data for charts
//   const revenueData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [
//       {
//         data: [20, 45, 28, 80, 99, 43],
//         color: (opacity = 1) => `rgba(42, 69, 194, ${opacity})`,
//         strokeWidth: 2
//       }
//     ]
//   };

//   const [activeTab, setActiveTab] = useState('day');

//   // Widget data
//   const widgets = [
//     { id: 1, title: 'Total Revenue', value: '$24,500', change: '+12%', icon: 'attach-money', color: '#4CAF50', gradient: ['#43A047', '#66BB6A'] },
//     { id: 2, title: 'Total Orders', value: '1,240', change: '+8%', icon: 'shopping-bag', color: '#2196F3', gradient: ['#1976D2', '#42A5F5'] },
//     { id: 3, title: 'New Customers', value: '254', change: '+5%', icon: 'person-add', color: '#9C27B0', gradient: ['#7B1FA2', '#AB47BC'] },
//     { id: 4, title: 'Conversion Rate', value: '12.5%', change: '+2%', icon: 'trending-up', color: '#FF9800', gradient: ['#F57C00', '#FFB74D'] },
//   ];

//   // Recent orders data
//   const recentOrders = [
//     { id: '#ORD-001', customer: 'Emma Wilson', amount: '$120.00', date: 'Today, 10:45 AM', status: 'Completed' },
//     { id: '#ORD-002', customer: 'Michael Johnson', amount: '$350.50', date: 'Today, 09:12 AM', status: 'Processing' },
//     { id: '#ORD-003', customer: 'Sophia Davis', amount: '$75.20', date: 'Yesterday, 03:45 PM', status: 'Completed' },
//     { id: '#ORD-004', customer: 'James Miller', amount: '$220.00', date: 'Yesterday, 01:30 PM', status: 'Cancelled' },
//   ];

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'Completed': return { bg: '#E8F5E9', text: '#4CAF50' };
//       case 'Processing': return { bg: '#E3F2FD', text: '#2196F3' };
//       case 'Cancelled': return { bg: '#FFEBEE', text: '#F44336' };
//       default: return { bg: '#E8F5E9', text: '#4CAF50' };
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#2A45C2" />
      
//       {/* Header */}
//       <LinearGradient
//         colors={['#2A45C2', '#1565C0']}
//         style={styles.header}
//       >
//         <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
//           <Ionicons name="menu" size={24} color="#FFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Dashboard</Text>
//         <View style={styles.headerIcons}>
//           <TouchableOpacity style={styles.iconButton}>
//             <Ionicons name="notifications-outline" size={24} color="#FFF" />
//             <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.profileButton}>
//             <Image 
//               source={{ uri: 'https://i.pravatar.cc/150?img=12' }} 
//               style={styles.headerProfileImage} 
//             />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>
      
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <Animated.View 
//           style={{
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }]
//           }}
//         >
//           {/* Widgets */}
//           <View style={styles.widgetsContainer}>
//             {widgets.map((widget) => (
//               <View key={widget.id} style={styles.widget}>
//                 <LinearGradient
//                   colors={widget.gradient}
//                   style={styles.widgetGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                 >
//                   <View style={styles.widgetContent}>
//                     <View style={styles.widgetLeft}>
//                       <Text style={styles.widgetTitle}>{widget.title}</Text>
//                       <Text style={styles.widgetValue}>{widget.value}</Text>
//                       <View style={styles.widgetChange}>
//                         <Ionicons 
//                           name={widget.change.startsWith('+') ? 'arrow-up' : 'arrow-down'} 
//                           size={14} 
//                           color="#FFFFFF" 
//                         />
//                         <Text style={styles.changeText}>{widget.change}</Text>
//                       </View>
//                     </View>
//                     <View style={styles.widgetIcon}>
//                       <MaterialIcons name={widget.icon} size={28} color="#FFFFFF" />
//                     </View>
//                   </View>
//                 </LinearGradient>
//               </View>
//             ))}
//           </View>
          
//           {/* Revenue Chart */}
//           <View style={styles.chartContainer}>
//             <View style={styles.chartHeader}>
//               <Text style={styles.chartTitle}>Revenue Overview</Text>
//               <View style={styles.chartTabs}>
//                 <TouchableOpacity 
//                   style={[styles.chartTab, activeTab === 'day' && styles.chartTabActive]}
//                   onPress={() => setActiveTab('day')}
//                 >
//                   <Text style={[styles.chartTabText, activeTab === 'day' && styles.chartTabTextActive]}>Day</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                   style={[styles.chartTab, activeTab === 'week' && styles.chartTabActive]}
//                   onPress={() => setActiveTab('week')}
//                 >
//                   <Text style={[styles.chartTabText, activeTab === 'week' && styles.chartTabTextActive]}>Week</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                   style={[styles.chartTab, activeTab === 'month' && styles.chartTabActive]}
//                   onPress={() => setActiveTab('month')}
//                 >
//                   <Text style={[styles.chartTabText, activeTab === 'month' && styles.chartTabTextActive]}>Month</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <LineChart
//               data={revenueData}
//               width={width - 48}
//               height={220}
//               chartConfig={{
//                 backgroundColor: '#FFFFFF',
//                 backgroundGradientFrom: '#FFFFFF',
//                 backgroundGradientTo: '#FFFFFF',
//                 decimalPlaces: 0,
//                 color: (opacity = 1) => `rgba(42, 69, 194, ${opacity})`,
//                 labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                 style: {
//                   borderRadius: 16
//                 },
//                 propsForDots: {
//                   r: '6',
//                   strokeWidth: '2',
//                   stroke: '#2A45C2'
//                 },
//                 propsForBackgroundLines: {
//                   strokeDasharray: '',
//                   stroke: '#F0F0F0',
//                   strokeWidth: 1
//                 },
//                 fillShadowGradient: '#2A45C2',
//                 fillShadowGradientOpacity: 0.2,
//               }}
//               bezier
//               style={styles.chart}
//             />
//           </View>
          
//           {/* Recent Orders */}
//           <View style={styles.ordersContainer}>
//             <View style={styles.ordersHeader}>
//               <Text style={styles.ordersTitle}>Recent Orders</Text>
//               <TouchableOpacity style={styles.viewAllButton}>
//                 <Text style={styles.viewAllText}>View All</Text>
//                 <MaterialIcons name="chevron-right" size={16} color="#2A45C2" />
//               </TouchableOpacity>
//             </View>
            
//             {recentOrders.map((order, index) => (
//               <View key={order.id} style={[
//                 styles.orderCard,
//                 index === recentOrders.length - 1 && styles.lastOrderCard
//               ]}>
//                 <View style={styles.orderInfo}>
//                   <Text style={styles.orderId}>{order.id}</Text>
//                   <Text style={styles.orderCustomer}>{order.customer}</Text>
//                   <Text style={styles.orderDate}>{order.date}</Text>
//                 </View>
//                 <View style={styles.orderDetails}>
//                   <Text style={styles.orderAmount}>{order.amount}</Text>
//                   <View style={[
//                     styles.statusBadge, 
//                     { backgroundColor: getStatusColor(order.status).bg }
//                   ]}>
//                     <Text style={[
//                       styles.statusText, 
//                       { color: getStatusColor(order.status).text }
//                     ]}>
//                       {order.status}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             ))}
            
//             <TouchableOpacity style={styles.seeMoreButton}>
//               <Text style={styles.seeMoreText}>See More Orders</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </ScrollView>
//     </View>
//   );
// };

// // Analytics Screen Component with improved design
// const AnalyticsScreen = () => (
//   <View style={styles.emptyScreenContainer}>
//     <LinearGradient
//       colors={['#2A45C2', '#1565C0']}
//       style={styles.emptyScreenHeader}
//     >
//       <Text style={styles.emptyScreenTitle}>Analytics</Text>
//     </LinearGradient>
//     <View style={styles.emptyScreenContent}>
//       <View style={styles.emptyScreenIconContainer}>
//         <MaterialIcons name="bar-chart" size={80} color="#CFD8DC" />
//       </View>
//       <Text style={styles.emptyScreenHeading}>Analytics Dashboard</Text>
//       <Text style={styles.emptyScreenDescription}>
//         Your analytics data will appear here once you start tracking your business metrics.
//       </Text>
//       <TouchableOpacity style={styles.emptyScreenButton}>
//         <Text style={styles.emptyScreenButtonText}>Set Up Analytics</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// );

// // Products Screen Component with improved design
// const ProductsScreen = () => (
//   <View style={styles.emptyScreenContainer}>
//     <LinearGradient
//       colors={['#2A45C2', '#1565C0']}
//       style={styles.emptyScreenHeader}
//     >
//       <Text style={styles.emptyScreenTitle}>Products</Text>
//     </LinearGradient>
//     <View style={styles.emptyScreenContent}>
//       <View style={styles.emptyScreenIconContainer}>
//         <MaterialIcons name="inventory" size={80} color="#CFD8DC" />
//       </View>
//       <Text style={styles.emptyScreenHeading}>Products Inventory</Text>
//       <Text style={styles.emptyScreenDescription}>
//         Your product catalog will be displayed here. Add products to get started.
//       </Text>
//       <TouchableOpacity style={styles.emptyScreenButton}>
//         <Text style={styles.emptyScreenButtonText}>Add New Product</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// );

// // Customers Screen Component with improved design
// const CustomersScreen = () => (
//   <View style={styles.emptyScreenContainer}>
//     <LinearGradient
//       colors={['#2A45C2', '#1565C0']}
//       style={styles.emptyScreenHeader}
//     >
//       <Text style={styles.emptyScreenTitle}>Customers</Text>
//     </LinearGradient>
//     <View style={styles.emptyScreenContent}>
//       <View style={styles.emptyScreenIconContainer}>
//         <MaterialIcons name="people" size={80} color="#CFD8DC" />
//       </View>
//       <Text style={styles.emptyScreenHeading}>Customer Management</Text>
//       <Text style={styles.emptyScreenDescription}>
//         Your customer data and information will be displayed here once you add customers.
//       </Text>
//       <TouchableOpacity style={styles.emptyScreenButton}>
//         <Text style={styles.emptyScreenButtonText}>Add Customer</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// );

// // Settings Screen Component with improved design
// const SettingsScreen = () => (
//   <View style={styles.emptyScreenContainer}>
//     <LinearGradient
//       colors={['#2A45C2', '#1565C0']}
//       style={styles.emptyScreenHeader}
//     >
//       <Text style={styles.emptyScreenTitle}>Settings</Text>
//     </LinearGradient>
//     <View style={styles.emptyScreenContent}>
//       <View style={styles.emptyScreenIconContainer}>
//         <MaterialIcons name="settings" size={80} color="#CFD8DC" />
//       </View>
//       <Text style={styles.emptyScreenHeading}>Account Settings</Text>
//       <Text style={styles.emptyScreenDescription}>
//         Configure your account settings, preferences, and notifications here.
//       </Text>
//       <TouchableOpacity style={styles.emptyScreenButton}>
//         <Text style={styles.emptyScreenButtonText}>Configure Settings</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// );

// // Create the drawer navigator
// const Drawer = createDrawerNavigator();

// const Dashboard = () => {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator
//         initialRouteName="Dashboard"
//         drawerContent={(props) => <CustomDrawerContent {...props} />}
//         screenOptions={{
//           headerShown: false,
//           drawerActiveBackgroundColor: '#2A45C2',
//           drawerActiveTintColor: '#FFFFFF',
//           drawerInactiveTintColor: '#424242',
//           drawerLabelStyle: {
//             marginLeft: -20,
//             fontSize: 15,
//             fontWeight: '500'
//           },
//           drawerType: 'front',
//           overlayColor: 'rgba(0,0,0,0.6)',
//           swipeEnabled: true,
//           gestureEnabled: true,
//           drawerStyle: {
//             width: 280,
//           }
//         }}
//       >
//         <Drawer.Screen 
//           name="Dashboard" 
//           component={DashboardScreen} 
//           options={{
//             drawerIcon: ({color, size}) => (
//               <Ionicons name="home-outline" color={color} size={size} />
//             )
//           }}
//         />
//         <Drawer.Screen 
//           name="Analytics" 
//           component={AnalyticsScreen} 
//           options={{
//             drawerIcon: ({color, size}) => (
//               <Ionicons name="bar-chart-outline" color={color} size={size} />
//             )
//           }}
//         />
//         <Drawer.Screen 
//           name="Products" 
//           component={ProductsScreen} 
//           options={{
//             drawerIcon: ({color, size}) => (
//               <Ionicons name="cube-outline" color={color} size={size} />
//             )
//           }}
//         />
//         <Drawer.Screen 
//           name="Customers" 
//           component={CustomersScreen} 
//           options={{
//             drawerIcon: ({color, size}) => (
//               <Ionicons name="people-outline" color={color} size={size} />
//             )
//           }}
//         />
//         <Drawer.Screen 
//           name="Settings" 
//           component={SettingsScreen} 
//           options={{
//             drawerIcon: ({color, size}) => (
//               <Ionicons name="settings-outline" color={color} size={size} />
//             )
//           }}
//         />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// export default Dashboard;

// // Enhanced styles
// const styles = StyleSheet.create({
//   // Drawer styles
//   drawerContent: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   drawerContentContainer: {
//     flex: 1,
//   },
//   drawerHeader: {
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//   },
//   userInfoSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   profileImageContainer: {
//     marginRight: 15,
//   },
//   profileImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 3,
//     borderColor: 'rgba(255,255,255,0.8)',
//   },
//   userDetails: {
//     justifyContent: 'center',
//   },
//   userDisplayName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 5,
//   },
//   userRoleContainer: {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//   },
//   userRole: {
//     fontSize: 12,
//     color: '#FFFFFF',
//   },
//   drawerItems: {
//     paddingTop: 10,
//   },
//   drawerLine: {
//     height: 1,
//     backgroundColor: '#E0E0E0',
//     marginVertical: 10,
//     marginHorizontal: 16,
//   },
//   drawerFooter: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//     marginTop: 'auto',
//   },
//   versionText: {
//     fontSize: 12,
//     color: '#9E9E9E',
//     textAlign: 'center',
//   },
//   logoutLabel: {
//     color: '#FF5252',
//     fontWeight: '500',
//   },
  
//   // Dashboard styles
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FD',
//   },
//   header: {
//     paddingTop: 50,
//     paddingBottom: 20,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   menuButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF',
//     flex: 1,
//     marginLeft: 16,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconButton: {
//     marginLeft: 16,
//     position: 'relative',
//     padding: 4,
//   },
//   badge: {
//     position: 'absolute',
//     right: -2,
//     top: -2,
//     backgroundColor: '#FF5252',
//     borderRadius: 10,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#2A45C2',
//   },
//   badgeText: {
//     color: '#FFF',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   profileButton: {
//     marginLeft: 16,
//   },
//   headerProfileImage: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 2,
//     borderColor: '#FFF',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
  
//   // Widgets styles
//   widgetsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   widget: {
//     width: '48%',
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   widgetGradient: {
//     padding: 20,
//     height: 140,
//   },
//   widgetContent: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   widgetLeft: {
//     flex: 1,
//   },
//   widgetTitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginBottom: 10,
//   },
//   widgetValue: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 10,
//   },
//   widgetChange: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//   },
//   changeText: {
//     fontSize: 12,
//     marginLeft: 4,
//     fontWeight: '500',
//     color: '#FFFFFF',
//   },
//   widgetIcon: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     opacity: 0.8,
//   },
  
//   // Chart styles
//   chartContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   chartHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   chartTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   chartTabs: {
//     flexDirection: 'row',
//     backgroundColor: '#F0F2F8',
//     borderRadius: 20,
//     padding: 4,
//   },
//   chartTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 16,
//   },
//   chartTabActive: {
//     backgroundColor: '#2A45C2',
//   },
//   chartTabText: {
//     fontSize: 13,
//     color: '#757575',
//     fontWeight: '500',
//   },
//   chartTabTextActive: {
//     color: '#FFF',
//     fontWeight: '600',
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
  
//   // Orders styles
//   ordersContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   ordersHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   ordersTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: '#2A45C2',
//     fontWeight: '500',
//   },
//   orderCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   lastOrderCard: {
//     borderBottomWidth: 0,
//   },
//   orderInfo: {
//     flex: 1,
//   },
//   orderId: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   orderCustomer: {
//     fontSize: 14,
//     color: '#424242',
//     marginBottom: 4,
//   },
//   orderDate: {
//     fontSize: 12,
//     color: '#757575',
//   },
//   orderDetails: {
//     alignItems: 'flex-end',
//   },
//   orderAmount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 6,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   seeMoreButton: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: '#F0F2F8',
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   seeMoreText: {
//     fontSize: 14,
//     color: '#2A45C2',
//     fontWeight: '500',
//   },
  
//   // Empty Screen styles
//   emptyScreenContainer: {
//     flex: 1,
//     backgroundColor: '#F8F9FD',
//   },
//   emptyScreenHeader: {
//     paddingTop: 50,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   emptyScreenTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   emptyScreenContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 30,
//   },
//   emptyScreenIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#F0F2F8',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   emptyScreenHeading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//   },
//   emptyScreenDescription: {
//     fontSize: 16,
//     color: '#757575',
//     textAlign: 'center',
//     marginBottom: 30,
//     lineHeight: 24,
//   },
//   emptyScreenButton: {
//     backgroundColor: '#2A45C2',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },
//   emptyScreenButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Dashboard = () => {
  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({})