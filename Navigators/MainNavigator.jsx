import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Screens/Home'; // Import Home screen
import AuthNavigator from './AuthNavigator'; // Import AuthNavigator
import Shop from '../Screens/Product/Shop';
import Product from '../Screens/Product/Product';
import SingleProduct from '../Screens/Product/SingleProduct';
import BottomNavigator from './BottomNavigator'; // Import BottomNavigator
import Profile from '../Screens/User/Profile'; // Import Profile screen


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
        name="Shop" 
        component={Shop}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BottomNavigator" 
        component={BottomNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={Profile}
        options={{ headerShown: false }}
      />
       <Stack.Screen 
        name="Product" 
        component={Product}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SingleProduct" component={SingleProduct}
      options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainNavigator;