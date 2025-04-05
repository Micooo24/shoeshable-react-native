import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onNotificationPress,
  scrollY,
  notificationCount,
  colors
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Default colors if not provided
  const COLORS = colors || {
    primary: '#2c3e50',
    white: '#ffffff',
    light: '#f5f5f5'
  };
  
  // Animation values
  const searchBarOpacity = scrollY ? scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  }) : 1;

  return (
    <Animated.View 
      style={[
        styles.searchBarContainer,
        {
          opacity: searchBarOpacity,
          transform: scrollY ? [{ 
            translateY: scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: [0, -5],
              extrapolate: 'clamp',
            })
          }] : []
        }
      ]}
    >
      <View style={styles.searchBarWrapper}>
        <Animated.View 
          style={[
            styles.searchInputContainer,
            {
              flex: 1,
              marginRight: 12,
              transform: scrollY ? [{ 
                scale: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [1, 0.98],
                  extrapolate: 'clamp',
                })
              }] : []
            }
          ]}
        >
          <Feather 
            name="search" 
            size={22} 
            color={searchFocused ? COLORS.primary : '#7f8c8d'} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for shoes, brands, categories..."
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={onSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery && searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={onClearSearch}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={16} color="#7f8c8d" />
            </TouchableOpacity>
          )}
        </Animated.View>
        
        {/* Notification Icon */}
        <Animated.View 
          style={[
            styles.notificationContainer,
            {
              transform: scrollY ? [{ 
                scale: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [1, 0.98],
                  extrapolate: 'clamp',
                })
              }] : []
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="notifications" 
              size={24} 
              color={COLORS.primary} 
            />
            {notificationCount > 0 && (
              <View style={[styles.notificationBadge, { backgroundColor: '#e74c3c' }]}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 30 : 15,
    left: 16,
    right: 16,
    zIndex: 100,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.08)',
    height: 54,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    paddingVertical: 0,
    paddingRight: 40, // Space for clear button
    height: '100%',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(44, 62, 80, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    height: 54,
    width: 54,
    borderRadius: 16,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.08)',
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
