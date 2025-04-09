import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import Home from '../Screens/Home';
import AuthNavigator from './AuthNavigator';
import SingleProduct from '../Screens/Product/SingleProduct';
import BottomNavigator from './BottomNavigator';
import Cart from "../Screens/Features/Cart";
import Category from "../Screens/Features/Category";
import Trends from "../Screens/Features/Trends";
import Checkout from "../Screens/Features/Checkout";
import AdminNavigator from "./AdminDrawer";
import OrderDetails from '../Screens/Features/OrderDetails';
import Notification from '../Screens/Features/Notification';
import baseURL from '../assets/common/baseurl';
import PromotionDetails from '../Screens/Features/PromotionDetails';
import Orders from '../Screens/Features/Orders';
import Profile from '../Screens/User/Profile';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // We can still fetch user data to set admin status, but won't navigate automatically
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/auth/users`);
        
        if (!isMounted) return;
        
        const users = response.data.users;
      
        const currentUser = users.find(user => user.email === 'admin@gmail.com');
        if (currentUser && currentUser.role === 'admin' && isMounted) {
          setIsAdmin(true);
        }
        
        if (isMounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Configure screen options to minimize rendering issues during transitions
  const screenOptions = {
    headerShown: false,
    animation: 'slide_from_right', // More stable animation
    detachPreviousScreen: false,   // Keep previous screen mounted until new one is ready
    freezeOnBlur: true,           // Minimize background screen updates
  };

  // Only render the navigator after initialization to prevent empty renders
  if (!isInitialized) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={screenOptions}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
      <Stack.Screen name="AdminNavigator" component={AdminNavigator} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="Trends" component={Trends} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="PromotionDetails" component={PromotionDetails} />
      <Stack.Screen name="Orders" component={Orders} />
    </Stack.Navigator>
  );
};

export default MainNavigator;