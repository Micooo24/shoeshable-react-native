import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Animated,
  useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../Theme/color';
import { getCategoryIcon } from '../Utils/Icons/ProductIcons';


const ShoeCategoriesGrid = ({ onCategorySelect }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  
  const [categories] = useState(Object.values(getCategoryIcon));
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
      toValue: 1.05,
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

  const renderCategoryItem = (category) => {
    if (!category) return null;
    
    const isSelected = category === selectedCategory;
    
    return (
      <Animated.View 
        key={category}
        style={{
          transform: [{ scale: scaleAnims[category] }],
          marginRight: 8
        }}
      >
        <TouchableOpacity
          style={[
            styles.categoryPill,
            isSelected ? styles.selectedCategoryPill : null
          ]}
          onPress={() => handleCategorySelect(category)}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.categoryText, 
              isSelected && styles.selectedCategoryText
            ]} 
          >
            {formatCategoryName(category)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.headerBackground} />
      
      {/* Categories section - horizontal scrolling row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {categories.map(category => renderCategoryItem(category))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.transparent,
    marginVertical: 10,
  },
  categoriesRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.categoryBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedCategoryPill: {
    backgroundColor: COLORS.selectedCategoryBackground,
    borderColor: COLORS.selectedBorder,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.selectedBorder,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  selectedCategoryText: {
    fontWeight: '600',
    color: COLORS.selectedText,
  }
});

export default ShoeCategoriesGrid;