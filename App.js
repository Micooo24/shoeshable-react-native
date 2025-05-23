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

const navigationRef = createNavigationContainerRef();

// try comment

// Custom In-App Notification
const NotificationBanner = ({ title, body, onPress, onClose }) => {
  const [animation] = useState(new Animated.Value(-100));
  
  useEffect(() => {
    
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
    
  
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
  
  // Get user auth 
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

  useEffect(() => {
    console.log('Setting up Firebase Cloud Messaging...');
    
    
    // Request permission for notifications
    const requestUserPermission = async () => {
      try {
        console.log('Requesting notification permission...');
        const authStatus = await messaging().requestPermission();
        const enabled = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Notification permission granted:', authStatus);
          const token = await messaging().getToken();
          console.log('FCM Token:', token);
          
          registerForegroundHandler();
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('Permission request error:', error);
      }
    };

    // Custom foreground handler that shows an in-app notification banner
    const registerForegroundHandler = () => {
      messaging().onMessage(async remoteMessage => {
        console.log('FOREGROUND NOTIFICATION RECEIVED:');
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
    console.log('BACKGROUND NOTIFICATION RECEIVED:');
    console.log(JSON.stringify(remoteMessage, null, 2));
    return Promise.resolve();
  });

  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log(JSON.stringify(remoteMessage, null, 2));

      if (remoteMessage.data) {
        setTimeout(() => {
          if (navigationRef.isReady()) {
            if (remoteMessage.data.orderId) {
              navigationRef.navigate('OrderDetails', { 
                orderId: remoteMessage.data.orderId,
                userId: remoteMessage.data.userId || userAuth?.userId 
              });
            } else if (remoteMessage.data.screen === 'PromotionDetails' && remoteMessage.data.promotionId) {
              console.log('Navigating to PromotionDetails from initial notification');
              navigationRef.navigate('PromotionDetails', {
                promotionId: remoteMessage.data.promotionId,
                productId: remoteMessage.data.productId
              });
            }
          }
        }, 1000); 
      }
    } else {
      console.log('App opened normally (not from notification)');
    }
  });

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('APP BROUGHT FROM BACKGROUND BY NOTIFICATION:');
  console.log(JSON.stringify(remoteMessage, null, 2));

  if (remoteMessage.data) {
    if (navigationRef.isReady()) {
      if (remoteMessage.data.orderId) {
        navigationRef.navigate('OrderDetails', { 
          orderId: remoteMessage.data.orderId,
          userId: remoteMessage.data.userId || userAuth?.userId 
        });
      } else if (remoteMessage.data.screen === 'PromotionDetails' && remoteMessage.data.promotionId) {
        console.log('Navigating to PromotionDetails from background notification');
        navigationRef.navigate('PromotionDetails', {
          promotionId: remoteMessage.data.promotionId,
          productId: remoteMessage.data.productId
        });
      }
    }
  }
});


    requestUserPermission();

    return () => {
      console.log('Cleaning up FCM listeners');
    };
  }, []);

  // Handle notification banner press
  const handleNotificationPress = () => {
    if (notification && notification.data) {
      try {
        if (notification.data.orderId) {
          console.log('Navigating to OrderDetails with orderId:', notification.data.orderId);
          if (navigationRef.isReady()) {
            navigationRef.navigate('OrderDetails', { 
              orderId: notification.data.orderId,
              userId: notification.data.userId || userAuth?.userId 
            });
          }
        } else if (notification.data.screen === 'PromotionDetails' && notification.data.promotionId) {
          console.log('Navigating to PromotionDetails with:', {
            promotionId: notification.data.promotionId,
            productId: notification.data.productId
          });
          
          if (navigationRef.isReady()) {
            navigationRef.navigate('PromotionDetails', { 
              promotionId: notification.data.promotionId,
              productId: notification.data.productId
            });
          }
        } else if (notification.data.screen) {
          let screenName = notification.data.screen;
          if (screenName === 'OrderDetail') {
            screenName = 'OrderDetails';
          }
          
          console.log('Navigating to:', screenName);
          if (navigationRef.isReady()) {
            navigationRef.navigate(screenName, notification.data);
          }
        }
      } catch (error) {
        console.error('Navigation error:', error);
        Alert.alert('Navigation Error', 'Could not navigate to the requested screen.');
      }

      setNotification(null);
    }
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