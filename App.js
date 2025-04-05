import React, { useEffect } from 'react';
import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';
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

  // Set up Firebase Cloud Messaging
  useEffect(() => {
    console.log('🔔 Setting up Firebase Cloud Messaging...');
    
    // Request permission for notifications
    const requestUserPermission = async () => {
      try {
        console.log('🔔 Requesting notification permission...');
        const authStatus = await messaging().requestPermission();
        const enabled = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('✅ Notification permission granted:', authStatus);
          // Get FCM token for this device
          const token = await messaging().getToken();
          console.log('📱 FCM Token:', token);
        } else {
          console.log('❌ Notification permission denied');
        }
      } catch (error) {
        console.error('❌ Permission request error:', error);
      }
    };

    // For Android notification channels, we need to use AndroidManifest.xml
    // No need to create channels programmatically with Firebase Messaging alone
    
    // Foreground state messages handler
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('📬 FOREGROUND NOTIFICATION RECEIVED:');
      console.log(JSON.stringify(remoteMessage, null, 2));
      
      // Show alert for foreground notifications
      if (remoteMessage.notification) {
        console.log('📲 Showing alert for:', remoteMessage.notification.title);
        Alert.alert(
          remoteMessage.notification.title || 'New Notification',
          remoteMessage.notification.body || '',
          [{ text: 'OK', onPress: () => console.log('Notification alert closed') }],
          { cancelable: false }
        );
      }
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('🌙 BACKGROUND NOTIFICATION RECEIVED:');
      console.log(JSON.stringify(remoteMessage, null, 2));
      return Promise.resolve();
    });

    // Handle notification that caused the app to open
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🚀 APP OPENED BY NOTIFICATION:');
          console.log(JSON.stringify(remoteMessage, null, 2));
          console.log('Notification data:', remoteMessage.data);
          // You can add navigation logic here based on the notification
        } else {
          console.log('📱 App opened normally (not from notification)');
        }
      });

    // Handle notification opening app from background state
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('⏰ APP BROUGHT FROM BACKGROUND BY NOTIFICATION:');
      console.log(JSON.stringify(remoteMessage, null, 2));
      console.log('Notification data:', remoteMessage.data);
      // You can add navigation logic here based on the notification
    });

    // Request permissions
    requestUserPermission();

    // FOR TESTING - Verify FCM setup
    setTimeout(() => {
      console.log("🔍 Verifying FCM setup...");
      messaging().getToken().then(token => {
        console.log("📱 Current FCM token:", token);
        
        // Test if notification handlers are properly set up
        console.log("📊 FCM handlers status:");
        console.log("- Foreground notifications:", messaging().onMessage ? "✅ Ready" : "❌ Not set");
        console.log("- Background notifications:", messaging().setBackgroundMessageHandler ? "✅ Ready" : "❌ Not set");
        console.log("- App opening from notification:", messaging().getInitialNotification ? "✅ Ready" : "❌ Not set");
        console.log("- Background to foreground:", messaging().onNotificationOpenedApp ? "✅ Ready" : "❌ Not set");
      });
    }, 5000);

    // Clean up listeners
    return () => {
      console.log('🧹 Cleaning up FCM listeners');
      unsubscribeOnMessage();
    };
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