import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Animated,
  useWindowDimensions,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../Theme/color'; // Import your theme colors

// Complete shoe categories list
const SHOE_CATEGORIES = {
  ATHLETIC: 'athletic',
  RUNNING: 'running',
  BASKETBALL: 'basketball',
  CASUAL: 'casual',
  FORMAL: 'formal',
  BOOTS: 'boots',
  SANDALS: 'sandals',
  SNEAKERS: 'sneakers',
  HIKING: 'hiking',
  WALKING: 'walking',
  TRAINING: 'training',
  SOCCER: 'soccer',
  SKATEBOARDING: 'skateboarding',
  TENNIS: 'tennis',
  SLIP_ONS: 'slip-ons'
};

// Enhanced icon mapping with proper alternatives
const CATEGORY_ICONS = {
  athletic: "run",
  running: "run-fast",
  basketball: "basketball",
  casual: "shoe-sneaker",
  formal: "shoe-heel",
  boots: "shoe-formal",
  sandals: "shoe-print",
  sneakers: "shoe-sneaker",
  hiking: "hiking",
  walking: "walk",
  training: "weight-lifter",
  soccer: "soccer",
  skateboarding: "skateboard",
  tennis: "tennis",
  "slip-ons": "shoe-cleat"
};

export const ShoeCategories = ({ onCategorySelect, initialSelectedCategory = null, navigateOnSelect = false }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [categories] = useState(Object.values(SHOE_CATEGORIES));
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  
  // Dynamic column calculation with refined values for different screen sizes
  const getColumnsForWidth = (screenWidth) => {
    if (screenWidth >= 768) return 6; // Tablets in landscape
    if (screenWidth >= 600) return 5; // Tablets in portrait
    if (screenWidth >= 414) return 4; // Larger phones
    if (screenWidth >= 375) return 3; // Medium phones
    return 3; // Smaller phones
  };
  
  const NUM_COLUMNS = getColumnsForWidth(width);
  const HORIZONTAL_PADDING = 16;
  const ITEM_MARGIN = 8;
  const USABLE_WIDTH = width - (HORIZONTAL_PADDING * 2);
  const ITEM_SIZE = (USABLE_WIDTH / NUM_COLUMNS) - (ITEM_MARGIN * 2);
  const ITEM_HEIGHT = ITEM_SIZE * 1.2; // Slightly taller than wide for better proportions
  
  // Create animations for each category
  const animations = useMemo(() => 
    categories.reduce((acc, category) => {
      acc[category] = {
        scale: new Animated.Value(category === selectedCategory ? 1.05 : 1),
        opacity: new Animated.Value(category === selectedCategory ? 1 : 0.9),
        shadow: new Animated.Value(category === selectedCategory ? 1 : 0)
      };
      return acc;
    }, {}), 
  []);
  
  // Animation timing configuration for smoother transitions
  const animationConfig = {
    duration: 250,
    useNativeDriver: true
  };

  // Update animations when selected category changes
  useEffect(() => {
    if (!selectedCategory) return;
    
    categories.forEach(category => {
      const isSelected = category === selectedCategory;
      
      Animated.parallel([
        Animated.spring(animations[category].scale, {
          toValue: isSelected ? 1.08 : 0.95,
          friction: 7,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.timing(animations[category].opacity, {
          toValue: isSelected ? 1 : 0.75,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(animations[category].shadow, {
          toValue: isSelected ? 1 : 0,
          ...animationConfig
        })
      ]).start();
    });
  }, [selectedCategory]);

  // Format category name for display with improved presentation
  const formatCategoryName = (category) => {
    return category
      .split('_')
      .join(' ')
      .split('-')
      .join(' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  // Handle category selection with animation
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    
    if (navigateOnSelect) {
      // Navigate to FilteredProduct screen with the selected category
      navigation.navigate('FilteredProduct', { category });
    } else if (onCategorySelect) {
      // Call parent component's handler (for in-place filtering)
      onCategorySelect(category);
    }
  };

  const renderCategoryItem = ({ item: category }) => {
    if (!category) return <View style={{ width: ITEM_SIZE, height: ITEM_HEIGHT, margin: ITEM_MARGIN }} />;
    
    const isSelected = category === selectedCategory;
    const iconName = CATEGORY_ICONS[category] || 'shoe-sneaker';
    
    // Shadow interpolation for dynamic shadow effect
    const shadowStyle = Platform.OS === 'ios' 
      ? {
          shadowOpacity: animations[category].shadow.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.35]
          }),
          shadowRadius: animations[category].shadow.interpolate({
            inputRange: [0, 1],
            outputRange: [4, 10]
          })
        }
      : {
          elevation: animations[category].shadow.interpolate({
            inputRange: [0, 1],
            outputRange: [3, 8]
          })
        };
    
    return (
      <Animated.View 
        style={[
          {
            transform: [{ scale: animations[category].scale }],
            opacity: animations[category].opacity,
            margin: ITEM_MARGIN,
            width: ITEM_SIZE,
            height: ITEM_HEIGHT,
          },
          shadowStyle
        ]}
      >
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleCategorySelect(category)}
          activeOpacity={0.85}
        >
          <Animated.View 
            style={[
              styles.imageContainer,
              { 
                width: ITEM_SIZE, 
                height: ITEM_SIZE,
                borderWidth: isSelected ? 2 : 0,
                borderColor: COLORS.accent
              }
            ]}
          >
            <LinearGradient
              colors={isSelected ? 
                [COLORS.selectedGradientStart, COLORS.selectedGradientEnd] : 
                [COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              {/* Decorative design elements */}
              <View style={[styles.decorativeCircle, { 
                width: ITEM_SIZE * 1.2, 
                height: ITEM_SIZE * 1.2, 
                top: -ITEM_SIZE * 0.4,
                right: -ITEM_SIZE * 0.4,
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)'
              }]} />
              
              <View style={[styles.decorativeCircle, { 
                width: ITEM_SIZE * 0.8, 
                height: ITEM_SIZE * 0.8, 
                bottom: -ITEM_SIZE * 0.3,
                left: -ITEM_SIZE * 0.3,
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
              }]} />
              
              <View style={[styles.decorativeLine, { 
                transform: [{ rotate: '45deg' }],
                width: ITEM_SIZE * 1.4,
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.07)'
              }]} />
              
              <View style={[styles.decorativeLine, { 
                transform: [{ rotate: '-45deg' }],
                width: ITEM_SIZE * 1.4,
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
              }]} />
              
              {/* Icon with glow effect */}
              <View style={[styles.iconWrapper, { 
                width: ITEM_SIZE * 0.6, 
                height: ITEM_SIZE * 0.6,
                shadowColor: COLORS.white,
                shadowOpacity: isSelected ? 0.3 : 0.1,
                shadowRadius: isSelected ? 10 : 5,
                shadowOffset: { width: 0, height: 0 }
              }]}>
                <Icon 
                  name={iconName} 
                  size={ITEM_SIZE * 0.38} 
                  color={COLORS.white} 
                />
              </View>
              
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Icon 
                    name="check-circle" 
                    size={16} 
                    color={COLORS.white} 
                    style={styles.checkIcon}
                  />
                </View>
              )}
            </LinearGradient>
          </Animated.View>
          
          <Text 
            style={[
              styles.categoryName,
              { 
                width: ITEM_SIZE,
                color: isSelected ? COLORS.primary : COLORS.text
              }
            ]} 
            numberOfLines={1}
          >
            {formatCategoryName(category)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Create padding-aware grid layout
  const createRows = (data, numColumns) => {
    const rows = Math.floor(data.length / numColumns);
    let lastRowElements = data.length - (rows * numColumns);
    
    // If the last row isn't complete, pad with null elements for proper spacing
    while (lastRowElements !== 0 && lastRowElements < numColumns) {
      data = [...data, null];
      lastRowElements++;
    }
    
    return data;
  };

  const paddedCategories = createRows([...categories], NUM_COLUMNS);

  // For standalone category page, add header
  const renderStandaloneHeader = () => (
    navigateOnSelect ? (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrapper}>
            <Text style={styles.headerTitle}>Categories</Text>
            <Text style={styles.headerSubtitle}>Find your perfect fit</Text>
          </View>
        </View>
      </View>
    ) : null
  );

  return (
    <View style={[
      styles.categoriesWrapper,
      navigateOnSelect && styles.standalonePageWrapper
    ]}>
      {navigateOnSelect && <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />}
      
      {renderStandaloneHeader()}
      
      <FlatList
        data={paddedCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => item ? item : `empty-${index}`}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={[
          styles.gridContent, 
          { 
            paddingHorizontal: HORIZONTAL_PADDING - ITEM_MARGIN,
            paddingTop: navigateOnSelect ? 20 : 10,
            paddingBottom: navigateOnSelect ? 80 : 20
          }
        ]}
        showsVerticalScrollIndicator={false}
        key={`categories-grid-${NUM_COLUMNS}`} // Force re-render when columns change
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesWrapper: {
    backgroundColor: COLORS.background,
  },
  standalonePageWrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(53, 99, 233, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitleWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    letterSpacing: 0.2,
  },
  gridContent: {
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 100,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 500,
  },
  decorativeLine: {
    position: 'absolute',
    height: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 2,
  }
});
