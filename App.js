import React, { useEffect } from 'react';
import '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './Navigators/MainNavigator';
import store from './Redux/store';
import { initializeTables, dropCartTable} from './sqlite_db/DatabaseInit';
import { Provider } from 'react-redux';

export default function App() {
  // Initialize database tables and optionally clear cart table
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // Initialize tables
        await initializeTables();
        console.log("Database initialized");

        // Uncomment the following line to clear the cart table on app start
        // await dropCartTable();
        // console.log("Cart table cleared");
      } catch (err) {
        console.error("Database setup error:", err);
      }
    };

    setupDatabase();
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