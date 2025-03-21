import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../Screens/User/Register'; // Import Register screen
import Login from '../Screens/User/Login'; // Import Login screen

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Register" 
        component={Register}
        options={{ headerShown: true, title: 'Register' }}
      />
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;