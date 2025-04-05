import React from 'react';
import { Dimensions } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../Theme/color';
import Dashboard from '../Screens/Admin/Dashboard';
import Analytics from '../Screens/Admin/Components/Analytics';
import Product from '../Screens/Admin/Components/Product';
import User from '../Screens/Admin/Components/User';
import Settings from '../Screens/Admin/Components/Settings';
import DrawerContent from '../Navigators/Components/DrawerContent';
import Order from '../Screens/Admin/Components/Orders';

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

// This is a wrapper component that creates a Drawer navigator for the Dashboard
const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.primary,
        drawerActiveTintColor: COLORS.textLight,
        drawerInactiveTintColor: COLORS.textDark,
        drawerItemStyle: {
          width: '100%',
          borderRadius: 0,
          marginVertical: 0,
          paddingVertical: 0,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.6)',
        swipeEnabled: true,
        gestureEnabled: true,
        drawerStyle: {
          width: width * 0.75 > 300 ? 300 : width * 0.75, // Responsive drawer width
          backgroundColor: COLORS.secondary,
        }
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          drawerLabel: "Dashboard"
        }}
      />
      <Drawer.Screen
        name="Analytics"
        component={Analytics}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          )
        }}
      />
      <Drawer.Screen
        name="ProductManagement"
        component={Product}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="cube-outline" color={color} size={size} />
          ),
          drawerLabel: "Products"
        }}
      />
      <Drawer.Screen
        name="Users"
        component={User}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="people-outline" color={color} size={size} />
          )
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          )
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={Order}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
          drawerLabel: "Orders"
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;