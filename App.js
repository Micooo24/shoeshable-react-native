import React, { useEffect, useState, useRef } from 'react';
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
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './Navigators/MainNavigator';
import store from './Redux/store';
import { initializeTables, dropCartTable } from './sqlite_db/DatabaseInit';
import { Provider } from 'react-redux';
import { getToken } from './sqlite_db/Auth'; 
// Create navigation ref for using navigation outside of screen components
const navigationRef = createNavigationContainerRef();

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
  const [userAuth, setUserAuth] = useState(null);
  
  // Get user auth when app starts
  useEffect(() => {
    const getUserAuth = async () => {
      try {
        const auth = await getToken();
        setUserAuth(auth);
        console.log("User authentication loaded");
      } catch (err) {
        console.error("Auth loading error:", err);
      }
    };
    
    getUserAuth();
  }, []);

  // Initialize database tables
  useEffect(() => {
    const setupDatabase = async () => {
      try {
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
    
    // Create Android notification channel
    if (Platform.OS === 'android') {
      try {
        // Use direct messaging().createChannel API instead of AndroidChannel constructor
        messaging()
          .createChannel({
            id: 'shoeshable-orders',
            name: 'Order Notifications',
            description: 'Notifications about your shoe orders',
            importance: 4, // HIGH importance (4)
            sound: 'default',
            vibration: true,
            lightColor: '#1976D2'
          })
          .then(() => console.log('✅ Notification channel created'))
          .catch(err => console.error('❌ Failed to create channel:', err));
      } catch (error) {
        console.error('Error creating notification channel:', error);
      }
    }
    
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
        }
      });
    };

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('🌙 BACKGROUND NOTIFICATION RECEIVED:');
      console.log(JSON.stringify(remoteMessage, null, 2));
      return Promise.resolve();
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('🚀 APP OPENED BY NOTIFICATION:');
        console.log(JSON.stringify(remoteMessage, null, 2));
        
        // App was opened from a quit state by notification
        // Handle navigation after app is ready
        if (remoteMessage.data && remoteMessage.data.orderId) {
          // We need to wait for navigation to be ready
          setTimeout(() => {
            if (navigationRef.isReady()) {
              navigationRef.navigate('OrderDetails', { 
                orderId: remoteMessage.data.orderId 
              });
            }
          }, 1000); // Small delay to ensure navigation is ready
        }
      } else {
        console.log('📱 App opened normally (not from notification)');
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('⏰ APP BROUGHT FROM BACKGROUND BY NOTIFICATION:');
      console.log(JSON.stringify(remoteMessage, null, 2));
      
      // Handle navigation for app opened from background
      if (remoteMessage.data && remoteMessage.data.orderId) {
        if (navigationRef.isReady()) {
          navigationRef.navigate('OrderDetails', { 
            orderId: remoteMessage.data.orderId 
          });
        }
      }
    });

    requestUserPermission();

    return () => {
      console.log('🧹 Cleaning up FCM listeners');
    };
  }, []);

  // Handle notification banner press
  const handleNotificationPress = () => {
    if (notification && notification.data) {
      // Handle navigation to OrderDetails if orderId is available
      if (notification.data.orderId) {
        console.log('Navigating to OrderDetails with orderId:', notification.data.orderId);
        if (navigationRef.isReady()) {
          navigationRef.navigate('OrderDetails', { 
            orderId: notification.data.orderId
          });
        }
      } else if (notification.data.screen) {
        // Generic navigation handling for other screens
        // Fix for screen name mismatch - Convert OrderDetail to OrderDetails if needed
        let screenName = notification.data.screen;
        if (screenName === 'OrderDetail') {
          screenName = 'OrderDetails';
        }
        
        console.log('Navigating to:', screenName);
        if (navigationRef.isReady()) {
          navigationRef.navigate(screenName, notification.data);
        }
      }
    }
    setNotification(null);
  };

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <MainNavigator userAuth={userAuth} />
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
  // Styles remain unchanged
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