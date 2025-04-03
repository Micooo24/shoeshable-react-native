import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProductBySlug } from '../../Redux/actions/productActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../Styles/singleProduct.js';
import { COLORS } from '../../Theme/color.js';
import { getBrandIcon, getCategoryIcon, getGenderIcon } from '../../Utils/Icons/ProductIcons';

const { width } = Dimensions.get('window');

const DisplaySingleProduct = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { slug, previewData } = route.params;
  
  // Get product data from Redux store
  const { currentProduct, productLoading, productError } = useSelector(state => state.product);
  
  // Local state for UI rendering
  const [product, setProduct] = useState(previewData || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const imageCarouselRef = useRef(null);
  useEffect(() => {
    dispatch(getProductBySlug(slug));
  }, [dispatch, slug]);
  useEffect(() => {
    if (currentProduct) {
      setProduct(currentProduct);
    }
  }, [currentProduct]);

  if (productError && !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color={COLORS.danger} />
          <Text style={styles.errorText}>Error: {productError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(getProductBySlug(slug))}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getProcessedImages = () => {
    if (!product || !product.image || !product.image.length) {
      return [{ uri: null, isPlaceholder: true }];
    }
    
    return product.image.map(img => ({
      uri: typeof img === 'string' ? img : (img && img.uri ? img.uri : null),
      isPlaceholder: false
    }));
  };

  const handleScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setActiveImageIndex(pageNum);
  };

  // Navigate to a specific image
  const goToImage = (index) => {
    if (imageCarouselRef.current) {
      imageCarouselRef.current.scrollToOffset({ 
        offset: index * width,
        animated: true 
      });
    }
  };

  const MaterialIconsPeso = ({ size, color }) => (
    <Text style={{fontSize: size * 0.8, color: color, fontWeight: 'bold'}}>₱</Text>
  );
  
  // Render image item for carousel
  const renderImageItem = ({ item }) => {
    if (item.isPlaceholder) {
      return (
        <View style={styles.imagePlaceholder}>
          <Icon name="shoe-sneaker" size={80} color={COLORS.primaryLight} />
        </View>
      );
    }
    
    return (
      <View style={styles.carouselImageContainer}>
        <Image
          source={{ uri: item.uri }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Icon name="cart-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      {productLoading && !product ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={imageCarouselRef}
              data={getProcessedImages()}
              renderItem={renderImageItem}
              keyExtractor={(_, index) => `image-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScrollEnd}
            />
            
            {/* Loading overlay for images if we're still fetching full data */}
            {productLoading && previewData && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={COLORS.white} />
              </View>
            )}
            
            {/* Image Pagination Indicators */}
            {product && product.image && product.image.length > 1 && (
              <View style={styles.paginationContainer}>
                {product.image.map((_, index) => (
                  <TouchableOpacity 
                    key={`dot-${index}`} 
                    style={[
                      styles.paginationDot, 
                      activeImageIndex === index && styles.paginationDotActive
                    ]}
                    onPress={() => goToImage(index)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Thumbnail Navigation */}
          {product && product.image && product.image.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContainer}
            >
              {product.image.map((img, index) => {
                const imageUri = typeof img === 'string' ? img : (img && img.uri ? img.uri : null);
                return imageUri ? (
                  <TouchableOpacity 
                    key={`thumb-${index}`}
                    onPress={() => goToImage(index)}
                    style={[
                      styles.thumbnailWrapper,
                      activeImageIndex === index && styles.activeThumbnail
                    ]}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : null;
              })}
            </ScrollView>
          )}

          {/* Product Information */}
          <View style={styles.productInfoContainer}>
            <Text style={styles.productName}>{product?.name || 'Loading...'}</Text>

            {/* Price and Stock */}
            <View style={styles.priceStockContainer}>
              <View style={styles.priceContainer}>
              <MaterialIconsPeso size={20} color={COLORS.primary} />
                <Text style={styles.priceText}>
                  {product && typeof product.price === 'number' 
                    ? product.price.toFixed(2) 
                    : product?.price || 'Loading...'}
                </Text>
              </View>

              {product?.stock !== undefined && (
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
              )}
            </View>

            {/* Product Metadata */}
            <View style={styles.metadataContainer}>
              {product?.brand && (
                <View style={styles.metadataItem}>
                  {getBrandIcon(product.brand)}
                  <Text style={styles.metadataText}>
                    <Text style={styles.metadataLabel}>Brand: </Text>
                    {product.brand}
                  </Text>
                </View>
              )}

              {product?.category && (
                <View style={styles.metadataItem}>
                  {getCategoryIcon(product.category)}
                  <Text style={styles.metadataText}>
                    <Text style={styles.metadataLabel}>Category: </Text>
                    {product.category}
                  </Text>
                </View>
              )}

              {product?.gender && (
                <View style={styles.metadataItem}>
                  {getGenderIcon(product.gender)}
                  <Text style={styles.metadataText}>
                    <Text style={styles.metadataLabel}>Gender: </Text>
                    {product.gender}
                  </Text>
                </View>
              )}

              {product?.material && (
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
            {product?.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{product.description}</Text>
              </View>
            )}

            {/* Available Sizes */}
            {product?.size && Array.isArray(product.size) && product.size.length > 0 && (
              <View style={styles.sizesContainer}>
                <Text style={styles.sectionTitle}>Available Sizes</Text>
                <View style={styles.sizesGrid}>
                  {product.size.map((size, index) => (
                    <View key={index} style={styles.sizeChip}>
                      <Text style={styles.sizeText}>{size}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Available Colors */}
            {product?.color && Array.isArray(product.color) && product.color.length > 0 && (
              <View style={styles.colorsContainer}>
                <Text style={styles.sectionTitle}>Available Colors</Text>
                <View style={styles.colorsGrid}>
                  {product.color.map((color, index) => (
                    <View key={index} style={styles.colorChip}>
                      <Text style={styles.colorText}>{color}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Bottom Action Bar */}
      {product && (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.wishlistButton}>
            <Icon name="heart-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          {/* Add to Cart Button */}
          <TouchableOpacity 
            style={[
              styles.addToCartButton,
              (!product || parseInt(product.stock) === 0) && styles.disabledButton
            ]}
            disabled={!product || parseInt(product.stock) === 0}
          >
            <Icon name="cart-plus" size={24} color={COLORS.white} />
            <Text style={styles.buttonText} numberOfLines={1}>
              {!product ? 'Loading...' : parseInt(product.stock) === 0 ? 'OUT OF STOCK' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
          
          {/* Buy Now Button */}
          <TouchableOpacity 
            style={[
              styles.buyNowButton,
              (!product || parseInt(product.stock) === 0) && styles.disabledButton
            ]}
            disabled={!product || parseInt(product.stock) === 0}
          >
            <Icon name="flash" size={20} color={COLORS.primary} />
            <Text style={styles.buyNowText} numberOfLines={1}>
              {!product ? '...' : parseInt(product.stock) === 0 ? 'OUT' : 'Buy Now'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DisplaySingleProduct;