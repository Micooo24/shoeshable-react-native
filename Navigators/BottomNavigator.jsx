import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import CategoryScreen from '../Screens/Features/CategoryScreen';
import TrendsScreen from '../Screens/Features/TrendsScreen';
import CartScreen from '../Screens/Features/CartScreen';
import ProfileScreen from '../Screens/User/Profile';

// Color palette 
const COLORS = {
  primary: '#944535',
  primaryLight: '#B56E61',
  primaryDark: '#723227',
  white: '#FFFFFF',
  light: '#F8F5F4',
  grey: '#E8E1DF',
  darkGrey: '#9A8D8A',
  text: '#3D2E2A',
  textLight: '#5D4E4A',
  success: '#5A8F72',
  warning: '#EDAF6F',
  danger: '#D35E4D',
  shadow: 'rgba(76, 35, 27, 0.15)',
  gold: '#FFD700',
  navy: '#001F3F'
};

const BottomNavigator = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Home');

  // Handle tab changes
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  // Render the active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <Home navigation={navigation} />;
      case 'Category':
        return <CategoryScreen navigation={navigation} />;
      case 'Trends':
        return <TrendsScreen navigation={navigation} />;
      case 'Cart':
        return <CartScreen navigation={navigation} />;
      case 'Me':
        return <ProfileScreen navigation={navigation} />;
      default:
        return <Home navigation={navigation} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.light} />
      
      {/* Main Content Area */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Home' && styles.activeTabItem]}
          onPress={() => handleTabPress('Home')}
        >
          <Feather
            name="home"
            size={22}
            color={activeTab === 'Home' ? COLORS.navy : COLORS.darkGrey}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabLabel, activeTab === 'Home' && styles.activeTabLabel]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Category' && styles.activeTabItem]}
          onPress={() => handleTabPress('Category')}
        >
          <Feather
            name="grid"
            size={22}
            color={activeTab === 'Category' ? COLORS.navy : COLORS.darkGrey}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabLabel, activeTab === 'Category' && styles.activeTabLabel]}>
            Category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Trends' && styles.activeTabItem]}
          onPress={() => handleTabPress('Trends')}
        >
          <Feather
            name="trending-up"
            size={22}
            color={activeTab === 'Trends' ? COLORS.navy : COLORS.darkGrey}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabLabel, activeTab === 'Trends' && styles.activeTabLabel]}>
            Trends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Cart' && styles.activeTabItem]}
          onPress={() => handleTabPress('Cart')}
        >
          <Feather
            name="shopping-cart"
            size={22}
            color={activeTab === 'Cart' ? COLORS.navy : COLORS.darkGrey}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabLabel, activeTab === 'Cart' && styles.activeTabLabel]}>
            Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Me' && styles.activeTabItem]}
          onPress={() => handleTabPress('Me')}
        >
          <Feather
            name="user"
            size={22}
            color={activeTab === 'Me' ? COLORS.navy : COLORS.darkGrey}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabLabel, activeTab === 'Me' && styles.activeTabLabel]}>
            Me
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey,
    backgroundColor: COLORS.white,
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: COLORS.navy,
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
    color: COLORS.navy,
    fontWeight: '600',
  },
});