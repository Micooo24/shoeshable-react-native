import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

// Updated color palette to match the Home component
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
  shadow: 'rgba(44, 62, 80, 0.15)', // Shadow based on primary color
  accent: '#3498db',       // Accent blue
};

const BottomNavigator = ({ navigation, activeScreen = 'Home' }) => {
  // Use activeScreen prop as the current route
  const currentRouteName = activeScreen;

  // Safe navigation handler with fallback
  const navigateTo = (screenName) => {
    // If navigation is not available, just log it
    if (!navigation || typeof navigation.navigate !== 'function') {
      console.log(`Navigation to ${screenName} not available`);
      return;
    }
    
    // Only navigate if we're not already on this screen
    if (currentRouteName !== screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.tabItem, currentRouteName === 'Home' && styles.activeTabItem]}
        onPress={() => navigateTo('Home')}
      >
        <Feather
          name="home"
          size={22}
          color={currentRouteName === 'Home' ? COLORS.primary : COLORS.darkGrey}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabLabel, currentRouteName === 'Home' && styles.activeTabLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, currentRouteName === 'Category' && styles.activeTabItem]}
        onPress={() => navigateTo('Category')}
      >
        <Feather
          name="grid"
          size={22}
          color={currentRouteName === 'Category' ? COLORS.primary : COLORS.darkGrey}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabLabel, currentRouteName === 'Category' && styles.activeTabLabel]}>
          Category
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, currentRouteName === 'Trends' && styles.activeTabItem]}
        onPress={() => navigateTo('Trends')}
      >
        <Feather
          name="trending-up"
          size={22}
          color={currentRouteName === 'Trends' ? COLORS.primary : COLORS.darkGrey}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabLabel, currentRouteName === 'Trends' && styles.activeTabLabel]}>
          Trends
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, currentRouteName === 'Cart' && styles.activeTabItem]}
        onPress={() => navigateTo('Cart')}
      >
        <Feather
          name="shopping-cart"
          size={22}
          color={currentRouteName === 'Cart' ? COLORS.primary : COLORS.darkGrey}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabLabel, currentRouteName === 'Cart' && styles.activeTabLabel]}>
          Cart
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, currentRouteName === 'Profile' && styles.activeTabItem]}
        onPress={() => navigateTo('Profile')}
      >
        <Feather
          name="user"
          size={22}
          color={currentRouteName === 'Profile' ? COLORS.primary : COLORS.darkGrey}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabLabel, currentRouteName === 'Profile' && styles.activeTabLabel]}>
          Me
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey,
    backgroundColor: COLORS.white,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: COLORS.darkGrey,
    fontWeight: '400',
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});