import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../Screens/User/Register'; 
import Login from '../Screens/User/Login'; 
import Profile from '../Screens/User/Profile'; 

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Register" 
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;