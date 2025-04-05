import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../Styles/singleProduct.js';
import { COLORS } from '../../Theme/color.js';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { addToCart } from '../../Redux/actions/cartActions'; // Import addToCart
import { getToken } from '../../sqlite_db/Auth'; // Import getToken
const { width } = Dimensions.get('window');

const DisplaySingleProduct = ({ route, navigation }) => {
  const { product } = route.params;
  console.log('Product:', product); // Log the product details for debugging
  const dispatch = useDispatch(); // Initialize dispatch
  
  // State for selected size and color
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Add state for image selection
  
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

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Handle image selection
  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleSubmit = async () => {
    try {
        // Check if the user is authorized
        const tokenData = await getToken();
        const authToken = tokenData?.authToken;

        if (!authToken) {
            Alert.alert('Unauthorized', 'You must be logged in to add items to the cart.');
            return;
        }

        // Validate required fields
        if (!selectedSize || !selectedColor || !product._id || !product.brand || !product.category || !product.gender) {
            Alert.alert('Error', 'Product ID, brand, category, size, color, and gender are required.');
            return;
        }

        // Prepare the request payload
        const selectedDetails = {
            productId: product._id, // Ensure productId is included
            quantity: 1, // Default quantity
            brand: product.brand,
            category: product.category,
            size: selectedSize,
            color: selectedColor,
            gender: product.gender,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image && product.image.length > 0 ? product.image[0] : null, // Get the first image
        };

        // Dispatch the addToCart action and wait for the response
        const response = await dispatch(addToCart(selectedDetails));
        console.log('Product being added to cart:', JSON.stringify(selectedDetails));

        // Handle the response
        if (response?.success) {
            const { cartItem } = response;
            Alert.alert(
                'Success',
                `${cartItem.quantity} ${cartItem.brand} ${cartItem.category} (${cartItem.size}, ${cartItem.color}) added to your cart.`
            );
        } else {
            Alert.alert('Error', response?.message || 'Failed to add item to cart.');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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
        {/* Image Section */}
        <View style={styles.imageSection}>
          {/* Main Image */}
          <View style={styles.imageContainer}>
            {product.image && product.image.length > 0 ? (
              <Image
                source={{
                  uri: typeof product.image[selectedImageIndex] === 'string'
                    ? product.image[selectedImageIndex]
                    : (product.image[selectedImageIndex] && product.image[selectedImageIndex].uri 
                      ? product.image[selectedImageIndex].uri 
                      : null),
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
          
          {/* Image Selector - Only show if there are multiple images */}
          {product.image && product.image.length > 1 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContainer}
            >
              {product.image.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnailWrapper,
                    selectedImageIndex === index && styles.selectedThumbnail,
                  ]}
                  onPress={() => handleImageSelect(index)}
                >
                  <Image
                    source={{
                      uri: typeof img === 'string'
                        ? img
                        : (img && img.uri ? img.uri : null),
                    }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Information */}
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          
          {/* Price information */}
          <Text style={styles.priceText}>
            ₱{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </Text>
                
          {/* Brand Icon */}
          <View style={styles.metadataItem}>
            {getBrandIcon(product.brand)}
            <Text style={styles.metadataText}>
              <Text style={styles.metadataLabel}>Brand: </Text>
              {product.brand || 'Unknown'}
            </Text>
          </View>

          {/* Category Icon */}
          <View style={styles.metadataItem}>
            {getCategoryIcon(product.category)}
            <Text style={styles.metadataText}>
              <Text style={styles.metadataLabel}>Category: </Text>
              {product.category || 'Unknown'}
            </Text>
          </View>

          {/* Gender Icon */}
          <View style={styles.metadataItem}>
            {getGenderIcon(product.gender)}
            <Text style={styles.metadataText}>
              <Text style={styles.metadataLabel}>Gender: </Text>
              {product.gender || 'Unisex'}
            </Text>
          </View>

          {/* Material Icon */}
          <View style={styles.metadataItem}>
            <Icon name="cube-outline" size={18} color={COLORS.primary} />
            <Text style={styles.metadataText}>
              <Text style={styles.metadataLabel}>Material: </Text>
              {product.material ? product.material : 'Unknown'}
            </Text>
          </View>

          {/* Available Sizes */}
          <View style={styles.sizesContainer}>
            <Text style={styles.sectionTitle}>Available Sizes</Text>
            <View style={styles.sizesGrid}>
              {Array.isArray(product.size) &&
                product.size.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sizeChip,
                      selectedSize === size && { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() => handleSizeSelect(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && { color: COLORS.white },
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          {/* Available Colors */}
          <View style={styles.colorsContainer}>
            <Text style={styles.sectionTitle}>Available Colors</Text>
            <View style={styles.colorsGrid}>
              {Array.isArray(product.color) &&
                product.color.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorChip,
                      selectedColor === color && { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() => handleColorSelect(color)}
                  >
                    <Text
                      style={[
                        styles.colorText,
                        selectedColor === color && { color: COLORS.white },
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          {/* Product Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.wishlistButton}>
          <Icon name="heart-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            parseInt(product.stock) === 0 && styles.disabledButton,
          ]}
          disabled={parseInt(product.stock) === 0}
          onPress={handleSubmit}
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
            parseInt(product.stock) === 0 && styles.disabledButton,
          ]}
          disabled={parseInt(product.stock) === 0}
          onPress={handleSubmit}
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