import { initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_zMqRkXAiHYBnc1aIGDi6AfTrwCL3SVg",
    authDomain: "shoeshable-e8142.firebaseapp.com",
    projectId: "shoeshable-e8142",
    storageBucket: "shoeshable-e8142.appspot.com",
    messagingSenderId: "80143970667",
    appId: "1:80143970667:android:1ead76556cf20bc4ce9c2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firebase Cloud Messaging
const fcmMessaging = messaging();

// Request permission function
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled = 
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    return true;
  }
  console.log('User notification permission denied');
  return false;
};

// Get FCM token function
const getFCMToken = async () => {
  try {
    // Check permission first
    const hasPermission = await requestUserPermission();
    if (!hasPermission) return null;
    
    // Get token
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export { auth, app, fcmMessaging, getFCMToken, requestUserPermission };