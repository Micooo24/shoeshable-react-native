import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to import Ionicons
import BottomNavigator from '../../Navigators/BottomNavigator';
import { getToken } from '../../sqlite_db/Auth';
import baseURL from '../../assets/common/baseurl';

const COLORS = {
  primary: '#2c3e50',
  primaryLight: '#34495e',
  primaryDark: '#1a2530',
  white: '#ffffff',
  light: '#ecf0f1',
  grey: '#bdc3c7',
  darkGrey: '#7f8c8d',
  text: '#2c3e50',
  textLight: '#7f8c8d',
  success: '#2ecc71',
  warning: '#f39c12',
  danger: '#e74c3c',
  shadow: 'rgba(44, 62, 80, 0.15)',
  accent: '#3498db',
};

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const auth = await getToken();
      if (!auth) return;

      const response = await fetch(`${baseURL}/api/orders/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.orderId })}
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
      <Text style={styles.notificationTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        {/* Add back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.orderId.toString()}
            renderItem={renderNotificationItem}
          />
        ) : (
          <Text style={styles.emptyText}>No notifications available</Text>
        )}
      </View>

      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Notifications" />
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    flexDirection: 'row', // Add this for proper layout
    alignItems: 'center', // Center items vertically
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    flex: 1, // This centers the text with the back button present
  },
  content: {
    flex: 1,
    padding: 10,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    backgroundColor: COLORS.white,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 16,
  },
  notificationBody: {
    color: COLORS.darkGrey,
    fontSize: 14,
    marginVertical: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 20,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
});