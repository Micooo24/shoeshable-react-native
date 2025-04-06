import React, { useEffect, useState } from 'react';
import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { 
  Platform, 
  Alert, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './Navigators/MainNavigator';
import store from './Redux/store';
import { initializeTables, dropCartTable } from './sqlite_db/DatabaseInit';
import { Provider } from 'react-redux';

// Custom in-app notification banner component
const NotificationBanner = ({ title, body, onPress, onClose }) => {
  const [animation] = useState(new Animated.Value(-100));
  
  useEffect(() => {
    // Slide in
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    Animated.timing(animation, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      if (onClose) onClose();
    });
  };
  
  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: animation }] }]}>
      <TouchableOpacity style={styles.bannerContent} onPress={onPress}>
        <View>
          <Text style={styles.bannerTitle}>{title}</Text>
          <Text style={styles.bannerBody}>{body}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [notification, setNotification] = useState(null);
  
 

  // Initialize database tables and optionally clear cart table
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // Initialize tables
        await initializeTables();
        console.log("Database initialized");
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
          const token = await messaging().getToken();
          console.log('📱 FCM Token:', token);
          
          registerForegroundHandler();
        } else {
          console.log('❌ Notification permission denied');
        }
      } catch (error) {
        console.error('❌ Permission request error:', error);
      }
    };

    // Custom foreground handler that shows an in-app notification banner
    const registerForegroundHandler = () => {
      messaging().onMessage(async remoteMessage => {
        console.log('📬 FOREGROUND NOTIFICATION RECEIVED:');
        console.log(JSON.stringify(remoteMessage, null, 2));
        
        if (remoteMessage.notification) {
          // Show custom in-app notification banner
          setNotification({
            title: remoteMessage.notification.title || 'New Notification',
            body: remoteMessage.notification.body || '',
            data: remoteMessage.data || {}
          });
          
          // For Android, this will now display a heads-up notification as well
          // because we've configured the channel properly with firebase.json
        }
      });
    };

    // Rest of your existing messaging setup
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('🌙 BACKGROUND NOTIFICATION RECEIVED:');
      console.log(JSON.stringify(remoteMessage, null, 2));
      return Promise.resolve();
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('🚀 APP OPENED BY NOTIFICATION:');
        console.log(JSON.stringify(remoteMessage, null, 2));
      } else {
        console.log('📱 App opened normally (not from notification)');
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('⏰ APP BROUGHT FROM BACKGROUND BY NOTIFICATION:');
      console.log(JSON.stringify(remoteMessage, null, 2));
      // Handle navigation based on notification data
      if (remoteMessage.data && remoteMessage.data.screen) {
        console.log('📱 Navigation target:', remoteMessage.data.screen);
        // You can store this to navigate after app is ready
      }
    });

    requestUserPermission();

    return () => {
      console.log('🧹 Cleaning up FCM listeners');
    };
  }, []);

  // Handle notification banner press
  const handleNotificationPress = () => {
    if (notification && notification.data && notification.data.screen) {
      // You can add navigation logic here
      console.log('Navigating to:', notification.data.screen);
      // Example: 
      // navigation.navigate(notification.data.screen, { 
      //   orderId: notification.data.orderId 
      // });
    }
    setNotification(null);
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
        <StatusBar style="auto" />
        
        {/* Custom in-app notification banner */}
        {notification && (
          <NotificationBanner
            title={notification.title}
            body={notification.body}
            onPress={handleNotificationPress}
            onClose={() => setNotification(null)}
          />
        )}
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1976D2',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  bannerContent: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bannerBody: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  }
});