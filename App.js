import React, { useEffect } from 'react';
import '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './Navigators/MainNavigator';
import store from './Redux/store';
import { Provider } from 'react-redux';
import { initializeTables } from './sqlite_db/DatabaseInit';

export default function App() {
  // Initialize database tables when app starts
  useEffect(() => {
    initializeTables()
      .then(() => console.log("Database initialized"))
      .catch(err => console.error("Database init error:", err));
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}