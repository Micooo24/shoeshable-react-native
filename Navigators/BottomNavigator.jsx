import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../Styles/navigator';
import { COLORS } from '../Theme/color';

const BottomNavigator = ({ navigation, activeScreen = 'Home' }) => {
  const currentRouteName = activeScreen;

  const navigateTo = (screenName) => {
    if (!navigation || typeof navigation.navigate !== 'function') {
      console.log(`Navigation to ${screenName} not available`);
      return;
    }
    
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
          onPress={() => navigation.navigate('Profile')}
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