import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
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

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation(); // Use useNavigation to access navigation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/auth/users`);
        const users = response.data.users;

        // Assuming you have a way to identify the current user (e.g., via token or context)
        const currentUser = users.find(user => user.email === 'admin@gmail.com'); // Replace with dynamic email or user ID

        if (currentUser && currentUser.role === 'admin') {
          setIsAdmin(true);
          navigation.navigate('AdminNavigator'); // Navigate to AdminNavigator if admin
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigation]);

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
    </Stack.Navigator>
  );
};

export default MainNavigator;