import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import BottomNavigator from '../../Navigators/BottomNavigator';

// Updated color palette
const COLORS = {
  primary: '#2c3e50',      // Dark blue-gray
  primaryLight: '#34495e', // Slightly lighter blue-gray
  primaryDark: '#1a2530',  // Darker blue-gray
  white: '#ffffff',        // Pure white
  light: '#ecf0f1',        // Light gray
  grey: '#bdc3c7',         // Medium gray
  darkGrey: '#7f8c8d',     // Darker gray
  text: '#2c3e50',         // Text in dark blue-gray
  textLight: '#7f8c8d',    // Light text in gray
  success: '#2ecc71',      // Success green
  warning: '#f39c12',      // Warning orange
  danger: '#e74c3c',       // Danger red
  shadow: 'rgba(44, 62, 80, 0.15)', 
  accent: '#3498db',       
};

// Notice the { navigation } parameter here - this is crucial
const CartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      
      {/* Cart Content */}
      <View style={styles.content}>
        <Text style={styles.emptyText}>Cart is empty</Text>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Cart" />
      </View>
    </View>
  );
};

export default CartScreen;

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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
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
  }
});