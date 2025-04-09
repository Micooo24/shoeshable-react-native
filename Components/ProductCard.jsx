import React from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../Theme/color';
import { getBrandIcon } from '../Utils/Icons/ProductIcons';
import { productCardStyles } from './Styles/productCard';

export const ProductCard = ({ item, navigation, onAddToCart }) => {
  // Simplified function that passes the entire product object
  const handleProductPress = (product) => {
    navigation.navigate('SingleProduct', { product });
  };

  return (
    <TouchableOpacity
      style={productCardStyles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      {/* Product Image Container - Only displaying first image */}
      <View style={productCardStyles.imageContainer}>
        {item.image && Array.isArray(item.image) && item.image.length > 0 ? (
          <Image
            source={{
              uri: typeof item.image[0] === 'string' 
                ? item.image[0] 
                : (item.image[0] && item.image[0].uri ? item.image[0].uri : null)
            }}
            style={productCardStyles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={productCardStyles.imagePlaceholder}>
            <Icon name="shoe-sneaker" size={48} color={COLORS.primaryLight} />
          </View>
        )}

        {/* Rest of component remains unchanged */}
        <LinearGradient
          colors={['transparent', 'rgba(44, 62, 80, 0.7)']}
          style={productCardStyles.imageGradient}
        />

        <View style={productCardStyles.badgeContainer}>
          {item.isWaterproof && (
            <View style={productCardStyles.waterproofBadge}>
              <Icon name="water" size={12} color={COLORS.white} />
              <Text style={productCardStyles.badgeText}>WP</Text>
            </View>
          )}
          
          {item.category && (
            <View style={productCardStyles.categoryBadge}>
              <Text style={productCardStyles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={productCardStyles.productInfo}>
        <View style={productCardStyles.brandRow}>
          {getBrandIcon(item.brand)}
          <Text style={productCardStyles.brandText}>{item.brand || 'Unknown'}</Text>
        </View>
        
        <Text style={productCardStyles.productName} numberOfLines={1}>
          {item.name || 'Unnamed Product'}
        </Text>

        <View style={productCardStyles.bottomRow}>
          <Text style={productCardStyles.priceText}>
            ₱{typeof item.price === 'number' ? item.price.toFixed(2) : (item.price || 'N/A')}
          </Text>
          <TouchableOpacity 
            style={productCardStyles.cartIconButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent triggering the parent's onPress
              onAddToCart && onAddToCart();
            }}
          >
            <Icon name="cart-plus" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};