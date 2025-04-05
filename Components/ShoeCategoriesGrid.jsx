import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  Animated,
  useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Professional color palette - minimalist approach
const COLORS = {
  primary: '#162B4D',
  secondary: '#486284', 
  border: '#D0D7E2',
  selectedBorder: '#3A7BEC',
  text: '#334155',
  selectedText: '#3A7BEC',
  icon: '#486284',
  selectedIcon: '#3A7BEC',
  headerBackground: '#FFFFFF',
  transparent: 'transparent'
};

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

// Fixed icon mapping with proper alternatives
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

const ShoeCategoriesGrid = ({ onCategorySelect }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  
  // Dynamically determine number of columns based on screen width
  const getNumColumns = (screenWidth) => {
    if (screenWidth >= 500) return 5; // More columns on larger screens
    if (screenWidth >= 375) return 4;
    return 3; // Minimum 3 columns for density
  };
  
  const NUM_COLUMNS = getNumColumns(width);
  const GRID_PADDING = 16;
  const ITEM_MARGIN = 8;
  const USABLE_WIDTH = width - (GRID_PADDING * 2);
  // Make items smaller for a more refined look
  const ITEM_SIZE = (USABLE_WIDTH / NUM_COLUMNS) - (ITEM_MARGIN * 2);
  
  const [categories] = useState(Object.values(SHOE_CATEGORIES));
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Create animation values for each category
  const [scaleAnims] = useState(() => 
    categories.reduce((acc, category) => {
      acc[category] = new Animated.Value(1);
      return acc;
    }, {})
  );

  // Function to handle category selection with animation
  const handleCategorySelect = (category) => {
    // Reset previous selection animation
    if (selectedCategory && selectedCategory !== category) {
      Animated.spring(scaleAnims[selectedCategory], {
        toValue: 1,
        friction: 5,
        useNativeDriver: true
      }).start();
    }

    setSelectedCategory(category);
    
    // Animate new selection
    Animated.spring(scaleAnims[category], {
      toValue: 1.05, // Smaller scale for subtle effect
      friction: 5,
      useNativeDriver: true
    }).start();
    
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      // Navigate with filter applied
      navigation.navigate('ProductList', { category });
    }
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category
      .split('_')
      .join(' ')
      .split('-')
      .join(' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const renderCategoryItem = ({ item: category }) => {
    if (!category) return <View style={[styles.categoryItem, { width: ITEM_SIZE, margin: ITEM_MARGIN }]} />;
    
    const isSelected = category === selectedCategory;
    const iconName = CATEGORY_ICONS[category] || 'shoe-sneaker';
    
    return (
      <Animated.View style={{
        transform: [{ scale: scaleAnims[category] }],
        margin: ITEM_MARGIN,
        width: ITEM_SIZE
      }}>
        <TouchableOpacity
          style={[styles.categoryItem, { width: ITEM_SIZE }]}
          onPress={() => handleCategorySelect(category)}
          activeOpacity={0.6}
        >
          <View style={[
            styles.iconContainer,
            { width: ITEM_SIZE, height: ITEM_SIZE * 0.8 }, // Smaller height
            isSelected ? styles.selectedIconContainer : styles.unselectedIconContainer
          ]}>
            <Icon 
              name={iconName} 
              size={ITEM_SIZE * 0.32} // Smaller icon
              color={isSelected ? COLORS.selectedIcon : COLORS.icon} 
            />
          </View>
          <Text 
            style={[
              styles.categoryName, 
              { width: ITEM_SIZE },
              isSelected && styles.selectedCategoryName
            ]} 
            numberOfLines={1}
          >
            {formatCategoryName(category)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.headerBackground} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity 
          style={styles.viewAllButton} 
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="chevron-right" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={paddedCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => item ? item : `empty-${index}`}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={[styles.gridContent, { paddingHorizontal: GRID_PADDING - ITEM_MARGIN }]}
        showsVerticalScrollIndicator={false}
        key={`grid-${NUM_COLUMNS}`} // Force re-render when columns change
        horizontal={false}
        scrollEnabled={false} // Disable scrolling as this is part of a larger screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.transparent,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.transparent,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  gridContent: {
    paddingVertical: 5,
  },
  categoryItem: {
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    backgroundColor: COLORS.transparent,
    marginBottom: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  unselectedIconContainer: {
    borderColor: COLORS.border,
  },
  selectedIconContainer: {
    borderColor: COLORS.selectedBorder,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.selectedBorder,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 2,
  },
  selectedCategoryName: {
    fontWeight: '600',
    color: COLORS.selectedText,
  }
});

export default ShoeCategoriesGrid;