import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Updated color palette with requested colors
const COLORS = {
  primary: '#2C3E50',       // Dark blue-gray (main color)
  primaryLight: '#34495E',  // Slightly lighter variant of primary
  primaryDark: '#1A2530',   // Darker variant of primary
  
  light: '#ECF0F1',         // Light gray (secondary color)
  lightDark: '#BDC3C7',     // Darker variant of light
  
  white: '#FFFFFF',
  black: '#000000',
  text: '#2C3E50',
  textLight: '#7F8C8D',
  
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  
  shadow: 'rgba(44, 62, 80, 0.15)',
  gold: '#F1C40F',
  accent: '#3498DB'
};

const DisplaySingleProduct = ({ route, navigation }) => {
  const { product } = route.params;

  const getBrandIcon = (brand) => {
    if (!brand) return <FontAwesome5 name="tag" size={18} color={COLORS.primary} />;
    
    switch (brand.toLowerCase()) {
      case 'nike':
        return <FontAwesome5 name="nike" size={18} color={COLORS.primary} />;
      case 'adidas':
        return <FontAwesome5 name="stripe-s" size={18} color={COLORS.primary} />;
      case 'jordan':
        return <Icon name="basketball" size={18} color={COLORS.primary} />;
      default:
        return <FontAwesome5 name="tag" size={18} color={COLORS.primary} />;
    }
  };

  const getCategoryIcon = (category) => {
    if (!category) return <Icon name="shoe-sneaker" size={18} color={COLORS.primary} />;
    
    switch (category.toLowerCase()) {
      case 'running':
        return <Icon name="run" size={18} color={COLORS.primary} />;
      case 'basketball':
        return <Icon name="basketball" size={18} color={COLORS.primary} />;
      case 'casual':
        return <FontAwesome5 name="shoe-prints" size={18} color={COLORS.primary} />;
      case 'formal':
        return <Icon name="tie" size={18} color={COLORS.primary} />;
      case 'boots':
        return <Icon name="boot-outline" size={18} color={COLORS.primary} />;
      case 'sandals':
        return <Icon name="shoe-sandal" size={18} color={COLORS.primary} />;
      default:
        return <Icon name="shoe-sneaker" size={18} color={COLORS.primary} />;
    }
  };

  const getGenderIcon = (gender) => {
    if (!gender) return <Icon name="gender-male-female" size={18} color={COLORS.primary} />;
    
    switch (gender.toLowerCase()) {
      case 'men':
        return <FontAwesome5 name="male" size={18} color={COLORS.primary} />;
      case 'women':
        return <FontAwesome5 name="female" size={18} color={COLORS.primary} />;
      case 'kids':
        return <FontAwesome5 name="child" size={18} color={COLORS.primary} />;
      default:
        return <Icon name="gender-male-female" size={18} color={COLORS.primary} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Icon name="cart-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          {product.image && product.image.length > 0 ? (
            <Image
              source={{
                uri: typeof product.image[0] === 'string'
                  ? product.image[0]
                  : (product.image[0] && product.image[0].uri ? product.image[0].uri : null)
              }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="shoe-sneaker" size={80} color={COLORS.primaryLight} />
            </View>
          )}
          
          {product.isWaterproof && (
            <View style={styles.waterproofBadge}>
              <Icon name="water" size={16} color={COLORS.white} />
              <Text style={styles.waterproofText}>Waterproof</Text>
            </View>
          )}
        </View>

        {/* Additional Images */}
        {product.image && product.image.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.additionalImagesContainer}
          >
            {product.image.slice(1).map((img, index) => {
              const imageUri = typeof img === 'string' ? img : (img && img.uri ? img.uri : null);
              return imageUri ? (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={styles.additionalImage}
                  resizeMode="cover"
                />
              ) : null;
            })}
          </ScrollView>
        )}

        {/* Product Information */}
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price and Stock */}
          <View style={styles.priceStockContainer}>
            <View style={styles.priceContainer}>
              <MaterialIcons name="attach-money" size={20} color={COLORS.primary} />
              <Text style={styles.priceText}>
                {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </Text>
            </View>

            <View style={styles.stockContainer}>
              <Icon
                name={parseInt(product.stock) > 0 ? "package-variant" : "package-variant-closed"}
                size={20}
                color={parseInt(product.stock) > 0 ? COLORS.success : COLORS.danger}
              />
              <Text
                style={[
                  styles.stockText,
                  parseInt(product.stock) > 10 ? styles.inStock : parseInt(product.stock) > 0 ? styles.lowStock : styles.outOfStock
                ]}
              >
                {parseInt(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Text>
            </View>
          </View>

          {/* Product Metadata */}
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              {getBrandIcon(product.brand)}
              <Text style={styles.metadataText}>
                <Text style={styles.metadataLabel}>Brand: </Text>
                {product.brand}
              </Text>
            </View>

            <View style={styles.metadataItem}>
              {getCategoryIcon(product.category)}
              <Text style={styles.metadataText}>
                <Text style={styles.metadataLabel}>Category: </Text>
                {product.category}
              </Text>
            </View>

            <View style={styles.metadataItem}>
              {getGenderIcon(product.gender)}
              <Text style={styles.metadataText}>
                <Text style={styles.metadataLabel}>Gender: </Text>
                {product.gender}
              </Text>
            </View>

            {product.material && (
              <View style={styles.metadataItem}>
                <Icon name="texture-box" size={18} color={COLORS.primary} />
                <Text style={styles.metadataText}>
                  <Text style={styles.metadataLabel}>Material: </Text>
                  {product.material}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          {/* Available Sizes */}
          <View style={styles.sizesContainer}>
            <Text style={styles.sectionTitle}>Available Sizes</Text>
            <View style={styles.sizesGrid}>
              {Array.isArray(product.size) && product.size.map((size, index) => (
                <View key={index} style={styles.sizeChip}>
                  <Text style={styles.sizeText}>{size}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Available Colors */}
          <View style={styles.colorsContainer}>
            <Text style={styles.sectionTitle}>Available Colors</Text>
            <View style={styles.colorsGrid}>
              {Array.isArray(product.color) && product.color.map((color, index) => (
                <View key={index} style={styles.colorChip}>
                  <Text style={styles.colorText}>{color}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.wishlistButton}>
          <Icon name="heart-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        {/* Add to Cart Button - Vertical Layout */}
        <TouchableOpacity 
          style={[
            styles.addToCartButton,
            parseInt(product.stock) === 0 && styles.disabledButton
          ]}
          disabled={parseInt(product.stock) === 0}
        >
          <Icon name="cart-plus" size={24} color={COLORS.white} />
          <Text style={styles.buttonText}>
            {parseInt(product.stock) === 0 ? 'OUT OF STOCK' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
        
        {/* Buy Now Button */}
        <TouchableOpacity 
          style={[
            styles.buyNowButton,
            parseInt(product.stock) === 0 && styles.disabledButton
          ]}
          disabled={parseInt(product.stock) === 0}
        >
          <Icon name="flash" size={24} color={COLORS.primary} />
          <Text style={styles.buyNowText}>
            {parseInt(product.stock) === 0 ? 'OUT OF STOCK' : 'Buy Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterproofBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  waterproofText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  additionalImagesContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.light,
  },
  additionalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  productInfoContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inStock: {
    color: COLORS.success,
  },
  lowStock: {
    color: COLORS.warning,
  },
  outOfStock: {
    color: COLORS.danger,
  },
  metadataContainer: {
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  metadataLabel: {
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  sizesContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  sizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeChip: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.lightDark,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  colorsContainer: {
    marginBottom: 24,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorChip: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.lightDark,
  },
  colorText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    backgroundColor: COLORS.white,
  },
  wishlistButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  addToCartButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  disabledButton: {
    backgroundColor: COLORS.lightDark,
    borderColor: COLORS.lightDark,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
  buyNowText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  }
});

export default DisplaySingleProduct;