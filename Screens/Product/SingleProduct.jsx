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
import { styles } from '../../Styles/singleProduct.js';
import { COLORS } from '../../Theme/color.js';

const { width } = Dimensions.get('window');

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

export default DisplaySingleProduct;