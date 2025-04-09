import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../../sqlite_db/Auth';

const PromotionDetails = ({ route }) => {
  const { promotionId, productId } = route.params;
  const [loading, setLoading] = useState(true);
  const [promotion, setPromotion] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Combined fetch for both auth and data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get authentication token
        const auth = await getToken();
        console.log("Authentication loaded for promotion details:", auth ? "Token found" : "No token");
        
        // Create headers with token if available
        let headers = {};
        if (auth && auth.authToken) {
          headers = {
            'Authorization': `Bearer ${auth.authToken}`
          };
          console.log("Using auth token for requests");
        } else {
          console.log("No auth token available, proceeding with public access");
        }
        
        // First try to fetch promotion with auth
        try {
          console.log(`Fetching promotion with ID: ${promotionId}`);
          const promotionResponse = await axios.get(
            `${baseURL}/api/promotions/${promotionId}`, 
            { headers }
          );
          
          setPromotion(promotionResponse.data.promotion);
          console.log("Promotion fetched successfully");
        } catch (promotionError) {
          console.error('Error fetching promotion:', promotionError.response?.status, promotionError.message);
          
          // If 401, try without auth as fallback
          if (promotionError.response?.status === 401) {
            console.log("Trying to fetch promotion without authentication");
            const publicPromotionResponse = await axios.get(`${baseURL}/api/promotions/${promotionId}`);
            setPromotion(publicPromotionResponse.data.promotion);
          } else {
            throw new Error(`Failed to fetch promotion: ${promotionError.message}`);
          }
        }
        
        // Then fetch product
        try {
          console.log(`Fetching product with ID: ${productId}`);
          const productResponse = await axios.get(
            `${baseURL}/api/products/get-product-by-id/${productId}`,
            { headers }
          );
          
          setProduct(productResponse.data.product);
          console.log("Product fetched successfully");
        } catch (productError) {
          console.error('Error fetching product:', productError.response?.status, productError.message);
          
          if (productError.response?.status === 404) {
            Alert.alert(
              "Product Not Found",
              "The product associated with this promotion could not be found. It may have been removed.",
              [{ text: "OK" }]
            );
          }
          
          // Even if product fetch fails, don't throw error yet, we'll show partial data
          console.log("Continuing with promotion details despite product fetch failure");
        }
      } catch (err) {
        console.error('Error in promotion details flow:', err);
        setError('Failed to load promotion details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [promotionId, productId]);

  // Format price after discount
  const calculateDiscountedPrice = (price, discountPercentage) => {
    const discountAmount = (price * discountPercentage) / 100;
    return price - discountAmount;
  };

  // Format price from cents to pesos
  const formatPrice = (price) => {
    if (!price) return '₱0.00';
    return `₱${(price / 100).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleViewProduct = () => {
    if (product) {
      navigation.navigate('SingleProduct', { product });
    } else {
      Alert.alert(
        "Product Unavailable", 
        "Sorry, this product is no longer available.",
        [{ text: "OK" }]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading promotion details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <Ionicons name="alert-circle" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={goBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!promotion) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <Ionicons name="alert-circle" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>Promotion not found.</Text>
        <TouchableOpacity style={styles.button} onPress={goBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Show promotion even if product is not found
  const discountedPrice = product ? calculateDiscountedPrice(product.price, promotion.discountPercentage) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3498db" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Special Promotion</Text>
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Promotion Banner */}
        <View style={styles.promotionBanner}>
          <Image
            source={{ uri: promotion.imageUrl || (product ? product.image[0] : null)}}
            style={styles.promotionImage}
            resizeMode="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{promotion.discountPercentage}% OFF</Text>
          </View>
        </View>
        
        {/* Promotion Title */}
        <View style={styles.promotionHeader}>
          <Text style={styles.promotionTitle}>{promotion.title || 'Special Offer'}</Text>
          <Text style={styles.validUntil}>
            Valid until {formatDate(promotion.endDate)}
          </Text>
        </View>
        
        {/* Product Info - Only shown if product exists */}
        {product ? (
          <View style={styles.productInfo}>
            <Image
              source={{ uri: product.image[0] }}
              style={styles.productImage}
              resizeMode="contain"
            />
            
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
                <Text style={styles.discountedPrice}>{formatPrice(discountedPrice)}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.productUnavailable}>
            <Ionicons name="alert-circle-outline" size={24} color="#e74c3c" />
            <Text style={styles.productUnavailableText}>
              Product is currently unavailable
            </Text>
          </View>
        )}
        
        {/* Promotion Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{promotion.description || 'No description available'}</Text>
        </View>
        
        {/* Promotion Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promotion Details</Text>
          <View style={styles.promotionDetail}>
            <Ionicons name="calendar-outline" size={20} color="#555" />
            <Text style={styles.detailText}>
              Start Date: {formatDate(promotion.startDate)}
            </Text>
          </View>
          <View style={styles.promotionDetail}>
            <Ionicons name="calendar" size={20} color="#555" />
            <Text style={styles.detailText}>
              End Date: {formatDate(promotion.endDate)}
            </Text>
          </View>
          <View style={styles.promotionDetail}>
            <Ionicons name="pricetag-outline" size={20} color="#555" />
            <Text style={styles.detailText}>
              Discount: {promotion.discountPercentage}% off
            </Text>
          </View>
        </View>
        
        {/* CTA Button - Only enabled if product exists */}
        {product ? (
          <TouchableOpacity style={styles.ctaButton} onPress={handleViewProduct}>
            <Text style={styles.ctaButtonText}>View Product</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.ctaButton, styles.disabledButton]}>
            <Text style={styles.ctaButtonText}>Product Unavailable</Text>
          </TouchableOpacity>
        )}
        
        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            * Terms and conditions apply. Promotion valid for a limited time only.
            The discount is applied at checkout.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  promotionBanner: {
    position: 'relative',
  },
  promotionImage: {
    width: '100%',
    height: 200,
  },
  discountBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  promotionHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  promotionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  validUntil: {
    fontSize: 14,
    color: '#777',
  },
  productInfo: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  productUnavailable: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fee',
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productUnavailableText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#e74c3c',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 10,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  promotionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
  },
  ctaButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsContainer: {
    padding: 16,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
  }
});

export default PromotionDetails;