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

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // We can still fetch user data to set admin status, but won't navigate automatically
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/auth/users`);
        const users = response.data.users;
        
        // Check if admin but don't navigate away from Home
        const currentUser = users.find(user => user.email === 'admin@gmail.com');
        if (currentUser && currentUser.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Even if this fails, we stay on Home
      }
    };

    fetchUserData();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      {/* Rest of your routes remain unchanged */}
      <Stack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminNavigator"
        component={AdminNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SingleProduct" component={SingleProduct} options={{ headerShown: false }} />
      <Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
      <Stack.Screen name="Trends" component={Trends} options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
      <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }} />
      <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
      <Stack.Screen name="PromotionDetails" component={PromotionDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainNavigator;