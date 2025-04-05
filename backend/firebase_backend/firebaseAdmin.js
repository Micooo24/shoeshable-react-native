const admin = require("firebase-admin");
const fs = require('fs');
const path = require('path');

// Better initialization with error handling
let firebaseApp;
try {
  // Check if already initialized
  firebaseApp = admin.app();
  console.log('Firebase Admin SDK already initialized');
} catch (e) {
  try {
    console.log('Initializing Firebase Admin SDK');
    const serviceAccountPath = path.join(__dirname, 'serviceAccountkey.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      console.error('ERROR: Service account key file missing at:', serviceAccountPath);
      throw new Error('Firebase service account key not found');
    }
    
    const serviceAccount = require("./serviceAccountkey.json");
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (initError) {
    console.error('Failed to initialize Firebase Admin:', initError);
  }
}

// Helper function to send notification to a single device
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  try {
    if (!fcmToken) {
      console.log('No FCM token provided, skipping notification');
      return { success: false, reason: 'no-token' };
    }
    
    if (!admin.apps.length) {
      console.log('Firebase not initialized, skipping notification');
      return { success: false, reason: 'firebase-not-initialized' };
    }
    
    // Ensure all data fields are strings as required by FCM
    const stringifiedData = {};
    Object.keys(data).forEach(key => {
      stringifiedData[key] = String(data[key]);
    });
    
    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        ...stringifiedData,
        title: String(title),
        body: String(body),
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'orders-channel',
          sound: 'default',
          priority: 'high',
          visibility: 'public',
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            contentAvailable: true,
          },
        },
      },
    };

    console.log('Sending notification to token:', fcmToken);
    const response = await admin.messaging().send(message);
    console.log('Successfully sent notification:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { 
      success: false, 
      reason: error.code || 'unknown',
      error: error.message
    };
  }
};

// Helper function to send notification to multiple devices
const sendMulticastNotification = async (fcmTokens, title, body, data = {}) => {
  try {
    // Filter out any null or undefined tokens
    const validTokens = fcmTokens.filter(token => token);
    
    if (!validTokens.length) {
      console.log('No valid FCM tokens provided, skipping notification');
      return { success: false, reason: 'no-valid-tokens' };
    }
    
    if (!admin.apps.length) {
      console.log('Firebase not initialized, skipping notification');
      return { success: false, reason: 'firebase-not-initialized' };
    }
    
    // Ensure all data fields are strings as required by FCM
    const stringifiedData = {};
    Object.keys(data).forEach(key => {
      stringifiedData[key] = String(data[key]);
    });
    
    const message = {
      tokens: validTokens, // Multiple tokens (up to 500)
      notification: {
        title,
        body,
      },
      data: {
        ...stringifiedData,
        title: String(title),
        body: String(body),
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'orders-channel',
          sound: 'default',
          priority: 'high',
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            contentAvailable: true,
          },
        },
      },
    };

    console.log(`Sending multicast notification to ${validTokens.length} devices`);
    const response = await admin.messaging().sendMulticast(message);
    console.log('Multicast notification results:', response.responses);
    console.log(`Success count: ${response.successCount}`);
    console.log(`Failure count: ${response.failureCount}`);
    
    return { 
      success: response.successCount > 0, 
      successCount: response.successCount, 
      failureCount: response.failureCount 
    };
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    return { 
      success: false, 
      reason: error.code || 'unknown',
      error: error.message
    };
  }
};

// Export the admin object and helper functions
module.exports = {
  admin,
  sendPushNotification,
  sendMulticastNotification
};