import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Screens/Home'; // Import Home screen
import AuthNavigator from './AuthNavigator';
import Product from '../Screens/Product/Product';
import SingleProduct from '../Screens/Product/SingleProduct';
import BottomNavigator from './BottomNavigator';
import Cart from "../Screens/Features/Cart";
import Category from "../Screens/Features/Category";
import Trends from "../Screens/Features/Trends";
import Profile from '../Screens/User/Profile';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
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
        name="Product" 
        component={Product}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SingleProduct" component={SingleProduct}
      options={{ headerShown: false }} />
      <Stack.Screen name="Category" component={Category}
      options={{ headerShown: false }} />
      <Stack.Screen name="Trends" component={Trends}
      options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={Cart}
      options={{ headerShown: false }} />
      <Stack.Screen 
        name="Profile" 
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;