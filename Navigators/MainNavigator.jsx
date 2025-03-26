import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Screens/Home'; // Import Home screen
import AuthNavigator from './AuthNavigator'; // Import AuthNavigator
import Shop from '../Screens/Product/Shop';

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
    </Stack.Navigator>
  );
};

export default MainNavigator;