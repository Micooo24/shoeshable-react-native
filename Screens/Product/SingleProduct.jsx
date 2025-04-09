import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Redux/actions/cartActions';
import { getToken } from '../../sqlite_db/Auth';
import { getBrandIcon, getCategoryIcon, getGenderIcon } from '../../Utils/Icons/ProductIcons';
import { COLORS } from '../../Theme/color';
import { styles } from '../../Styles/singleProduct'; // Assuming you have a separate file for styles
import { getAllReviews, createReview, updateReview, deleteReview } from '../../Redux/actions/reviewActions';
import { getMyOrders } from '../../Redux/actions/orderActions';
import baseURL from '../../assets/common/baseurl';

const { width, height } = Dimensions.get('window');

const DisplaySingleProduct = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  
  // State for product details
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // State for reviews
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [orderIdForReview, setOrderIdForReview] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [deletingReview, setDeletingReview] = useState(false);
  
  // Add wishlist state
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

// Replace the useEffect and related functions with this improved version
useEffect(() => {
  const initializeData = async () => {
    try {
      // First get current user ID
      const userId = await getCurrentUserId();
      
      if (userId) {
        setCurrentUserId(userId);
        console.log('Current user ID set:', userId);
        
        // Only fetch reviews and check eligibility after we have the user ID
        await fetchProductReviews();
        await checkIfUserCanReview();
        await checkWishlistStatus(); // Add this line to check wishlist status
      } else {
        console.warn('Could not obtain user ID, proceeding without it');
        // Still fetch reviews even if we don't have a user ID
        await fetchProductReviews();
      }
    } catch (error) {
      console.error('Error during initialization:', error);
      setLoading(false);
    }
  };
  
  initializeData();
}, []);

// Add useFocusEffect to check wishlist status whenever screen comes into focus
useFocusEffect(
  React.useCallback(() => {
    const checkStatus = async () => {
      if (currentUserId && product?._id) {
        console.log('Screen focused, checking wishlist status');
        await checkWishlistStatus();
      }
    };
    
    checkStatus();
    
    return () => {
      // Clean up if needed
    };
  }, [currentUserId, product?._id])
);

const getCurrentUserId = async () => {
  try {
    const tokenData = await getToken();
    console.log('Token data received:', tokenData);
    
    if (!tokenData || !tokenData.authToken) {
      console.log('No valid token found');
      return null;
    }
    
    // Get the actual token string
    const jwtToken = tokenData.authToken;
    console.log('JWT token:', jwtToken);
    
    try {
      // For JWT tokens: Parse the token to get the payload
      // JWT tokens consist of three parts: header.payload.signature
      const parts = jwtToken.split('.');
      if (parts.length === 3) {
        // Decode the payload (middle part)
        const payload = JSON.parse(atob(parts[1]));
        console.log('Decoded token payload:', payload);
        
        // Extract user ID from common JWT payload locations
        let userId = null;
        if (payload.user && payload.user._id) {
          userId = payload.user._id;
        } else if (payload._id) {
          userId = payload._id;
        } else if (payload.id) {
          userId = payload.id;
        } else if (payload.sub) {
          userId = payload.sub;  // Standard JWT subject claim
        } else if (payload.userId) {
          userId = payload.userId;
        }
        
        if (userId) {
          console.log('Found user ID in token payload:', userId);
          return userId;
        }
      }
    } catch (e) {
      console.error('Error parsing JWT token:', e);
    }
    
    // If we can't extract from JWT, make an API call as fallback
    // This would be where you call your API with the token to get user info
    console.log('Could not extract user ID from token, consider adding an API call');
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Improved wishlist status check
const checkWishlistStatus = async () => {
  try {
    if (!currentUserId || !product?._id) {
      console.log('Missing user ID or product ID for wishlist check');
      return;
    }
    
    setLoadingWishlist(true); // Show loading indicator while checking
    
    const tokenData = await getToken();
    if (!tokenData?.authToken) {
      console.log('No auth token available for wishlist check');
      setLoadingWishlist(false);
      return;
    }
    
    console.log('Checking wishlist status for:', {
      userId: currentUserId,
      productId: product._id
    });
    
    const response = await fetch(`${baseURL}/api/wishlist/check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUserId,
        productId: product._id
      })
    });
    
    if (!response.ok) {
      console.error('Wishlist check failed with status:', response.status);
      setLoadingWishlist(false);
      return;
    }
    
    const data = await response.json();
    console.log('Wishlist check response:', data);
    
    // Update the wishlist state
    setIsInWishlist(data.exists || false);
    console.log('Product is in wishlist:', data.exists ? 'Yes (❤️)' : 'No (♡)');
    setLoadingWishlist(false);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    setLoadingWishlist(false);
  }
};

// Improved toggleWishlist function with immediate UI feedback
const toggleWishlist = async () => {
  try {
    const tokenData = await getToken();
    
    if (!tokenData?.authToken) {
      Alert.alert('Unauthorized', 'You must be logged in to manage your wishlist.');
      return;
    }
    
    if (!currentUserId || !product?._id) {
      Alert.alert('Error', 'Missing user or product information.');
      return;
    }
    
    setLoadingWishlist(true);
    
    // Immediately update UI for better responsiveness
    const wasInWishlist = isInWishlist;
    setIsInWishlist(!wasInWishlist);
    
    if (!wasInWishlist) {
      // Add to wishlist
      const response = await fetch(`${baseURL}/api/wishlist/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUserId,
          productId: product._id
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success - UI already updated
        Alert.alert('Success', 'Product added to your wishlist.');
      } else if (response.status === 400 && data.message === 'Product already in wishlist') {
        // Already in wishlist - UI already correct
        Alert.alert('Info', 'This product is already in your wishlist.');
      } else {
        // Error - revert UI change
        setIsInWishlist(wasInWishlist);
        Alert.alert('Error', data.message || 'Failed to add to wishlist.');
      }
    } 
    else {
      // Remove from wishlist
      const response = await fetch(`${baseURL}/api/wishlist/remove/${product._id}?userId=${currentUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenData.authToken}`
        }
      });
      
      if (response.ok) {
        // Success - UI already updated
        Alert.alert('Success', 'Product removed from your wishlist.');
      } else {
        // Error - revert UI change
        setIsInWishlist(wasInWishlist);
        let errorMessage = 'Failed to remove from wishlist.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use default error message
        }
        Alert.alert('Error', errorMessage);
      }
    }
  } catch (error) {
    console.error('Error updating wishlist:', error);
    Alert.alert('Error', 'Network or server error. Please try again.');
  } finally {
    setLoadingWishlist(false);
  }
};

  const fetchProductReviews = async () => {
    try {
      const result = await dispatch(getAllReviews());
      if (result) {
        // Filter reviews for this specific product
        const filteredReviews = result.filter(review => review.productId === product._id);
        console.log(`Found ${filteredReviews.length} reviews for product ${product._id}`);
        
        // Log review details for debugging
        filteredReviews.forEach((review, index) => {
          console.log(`Review ${index + 1}:`, { 
            id: review._id,
            user: typeof review.user === 'object' ? review.user._id : review.user
          });
        });
        
        setProductReviews(filteredReviews);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const checkIfUserCanReview = async () => {
    try {
      console.log('Checking if user can review product:', product._id);
      const orders = await dispatch(getMyOrders());
      
      if (!orders || !Array.isArray(orders)) {
        console.log('No orders found or invalid orders data');
        return;
      }
      
      console.log(`Found ${orders.length} orders for user`);
      
      // Check if user has any delivered order containing this product
      const eligibleOrder = orders.find(order => {
        // Check if order is delivered - NOTE: using orderStatus with capital D in Delivered
        if (order.orderStatus !== 'Delivered') {
          console.log(`Order ${order._id} status is ${order.orderStatus}, not eligible`);
          return false;
        }
        
        // Check if order contains this product in orderItems array
        if (!order.orderItems || !Array.isArray(order.orderItems)) {
          console.log(`Order ${order._id} has no orderItems array`);
          return false;
        }
        
        // Check if product exists in order items
        const hasProduct = order.orderItems.some(item => {
          // Convert IDs to strings for proper comparison
          const itemProductId = item.productId?.toString();
          const currentProductId = product._id?.toString();
          
          console.log(`Comparing: ${itemProductId} with ${currentProductId}`);
          
          return itemProductId === currentProductId;
        });
        
        return hasProduct;
      });
      
      if (eligibleOrder) {
        console.log('Found eligible order for review:', eligibleOrder._id);
        setCanReview(true);
        setOrderIdForReview(eligibleOrder._id);
      } else {
        console.log('No eligible orders found for review');
        setCanReview(false);
      }
    } catch (error) {
      console.error('Error checking order history:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert('Invalid Rating', 'Please select a rating between 1 and 5.');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Missing Review', 'Please enter your review text.');
      return;
    }

    try {
      setSubmittingReview(true);
      
      if (isEditMode) {
        // Update existing review
        const reviewData = {
          reviewText,
          rating
        };

        console.log('Updating review:', currentReviewId, reviewData);

        const result = await dispatch(updateReview(currentReviewId, reviewData));
        setSubmittingReview(false);
        
        if (result) {
          Alert.alert('Success', 'Your review has been updated successfully.');
          setShowReviewModal(false);
          setReviewText('');
          setIsEditMode(false);
          setCurrentReviewId(null);
          // Refresh reviews
          fetchProductReviews();
        } else {
          Alert.alert('Error', 'Failed to update your review. Please try again.');
        }
      } else {
        // Create new review
        const reviewData = {
          productId: product._id,
          orderId: orderIdForReview,
          reviewText,
          rating
        };

        console.log('Submitting new review:', reviewData);

        const result = await dispatch(createReview(reviewData));
        setSubmittingReview(false);
        
        if (result) {
          Alert.alert('Success', 'Your review has been submitted successfully.');
          setShowReviewModal(false);
          setReviewText('');
          // Refresh reviews
          fetchProductReviews();
          // Update canReview state since user has already reviewed
          setCanReview(false);
        } else {
          Alert.alert('Error', 'Failed to submit your review. Please try again.');
        }
      }
    } catch (error) {
      setSubmittingReview(false);
      console.error('Error with review:', error);
      
      const errorMessage = error.message || 'An unexpected error occurred with your review.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleEditReview = (review) => {
    setIsEditMode(true);
    setCurrentReviewId(review._id);
    setReviewText(review.reviewText);
    setRating(review.rating);
    setShowReviewModal(true);
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete your review? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingReview(true);
              const result = await dispatch(deleteReview(reviewId));
              setDeletingReview(false);
              
              if (result) {
                Alert.alert('Success', 'Your review has been deleted successfully.');
                // Refresh reviews
                fetchProductReviews();
                // Allow user to review again after deleting
                await checkIfUserCanReview();
              } else {
                Alert.alert('Error', 'Failed to delete your review. Please try again.');
              }
            } catch (error) {
              setDeletingReview(false);
              console.error('Error deleting review:', error);
              const errorMessage = error.message || 'An unexpected error occurred while deleting your review.';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCancelEdit = () => {
    setShowReviewModal(false);
    setIsEditMode(false);
    setCurrentReviewId(null);
    setReviewText('');
    setRating(5);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleSubmit = async () => {
    try {
      const tokenData = await getToken();
      const authToken = tokenData?.authToken;

      if (!authToken) {
        Alert.alert('Unauthorized', 'You must be logged in to add items to the cart.');
        return;
      }

      if (!selectedSize || !selectedColor || !product._id || !product.brand || !product.category || !product.gender) {
        Alert.alert('Error', 'Please select a size and color before adding to cart.');
        return;
      }

      const selectedDetails = {
        productId: product._id,
        quantity: 1,
        brand: product.brand,
        category: product.category,
        size: selectedSize,
        color: selectedColor,
        gender: product.gender,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image && product.image.length > 0 ? product.image[0] : null,
      };

      const response = await dispatch(addToCart(selectedDetails));
      console.log('Product being added to cart:', JSON.stringify(selectedDetails));

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

  const isOutOfStock = parseInt(product.stock) === 0;

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<AntDesign key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<AntDesign key={i} name="staro" size={16} color="#FFD700" />);
      } else {
        stars.push(<AntDesign key={i} name="staro" size={16} color="#CCCCCC" />);
      }
    }
    
    return stars;
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((total, review) => total + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };
  
  // Get user display name based on populated user object
  const getUserDisplayName = (review) => {
    // Check if user is populated with firstName and lastName
    if (review.user && typeof review.user === 'object') {
      // If we have firstName and lastName fields
      if (review.user.firstName && review.user.lastName) {
        return `${review.user.firstName} ${review.user.lastName}`;
      }
      // If we only have one of the fields
      else if (review.user.firstName) {
        return review.user.firstName;
      }
      else if (review.user.lastName) {
        return review.user.lastName;
      }
    }
    
    // Fallback to user ID if not populated or missing name fields
    return `User ${typeof review.user === 'string' ? review.user.substring(0, 8) : 'Anonymous'}`;
  };

  // Get user profile image if available
  const getUserProfileImage = (review) => {
    if (review.user && typeof review.user === 'object' && 
        review.user.profileImage && review.user.profileImage.url) {
      return review.user.profileImage.url;
    }
    return null;
  };
  
  const isCurrentUserReview = (review) => {
    // Add more extensive debugging to identify issues
    console.log('Review ownership check data:', { 
      currentUserId: currentUserId,
      reviewId: review?._id,
      reviewUser: review?.user,
      reviewUserType: typeof review?.user
    });
    
    // Return false if we're missing essential data
    if (!currentUserId || !review) {
      console.log('Missing currentUserId or review object');
      return false;
    }
    
    // Handle case where review.user is undefined or null
    if (!review.user) {
      console.log('Review has no user property');
      return false;
    }
    
    // Convert currentUserId to string to ensure consistent comparison
    const currentUserIdStr = String(currentUserId).trim();
    
    // Get the reviewer's user ID from the review object, handling different data structures
    let reviewUserId;
    
    if (typeof review.user === 'object' && review.user !== null) {
      // Try all possible ID locations in the user object
      if (review.user._id) {
        reviewUserId = String(review.user._id).trim();
      } else if (review.user.id) {
        reviewUserId = String(review.user.id).trim();
      } else {
        console.log('User object does not contain expected ID field');
        return false;
      }
    } else if (typeof review.user === 'string') {
      // If review.user is already a string ID
      reviewUserId = String(review.user).trim();
    } else {
      console.log('Unexpected review.user type:', typeof review.user);
      return false;
    }
    
    // Perform the comparison and log the result
    const isOwner = reviewUserId === currentUserIdStr;
    console.log(`Comparison: "${reviewUserId}" vs "${currentUserIdStr}" = ${isOwner}`);
    
    return isOwner;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.imageCarousel}>
          <View style={styles.mainImageContainer}>
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
          
          {/* Image Thumbnails */}
          {product.image && product.image.length > 1 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailScroll}
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
                      uri: typeof img === 'string' ? img : (img && img.uri ? img.uri : null),
                    }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Information Card */}
        <View style={styles.productCard}>
          {/* Basic Info Section */}
          <View style={styles.basicInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.priceText}>
              ₱{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{calculateAverageRating()}</Text>
              <View style={styles.starsContainer}>
                {renderStars(calculateAverageRating())}
              </View>
              <Text style={styles.reviewCountText}>
                ({productReviews.length} {productReviews.length === 1 ? 'Review' : 'Reviews'})
              </Text>
            </View>
            
            {isOutOfStock ? (
              <View style={styles.stockStatus}>
                <Icon name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            ) : (
              <View style={styles.stockStatus}>
                <Icon name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.inStockText}>In Stock</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Product Metadata */}
          <View style={styles.metadataContainer}>
            <View style={styles.metadataRow}>
              <View style={styles.metadataItem}>
                {getBrandIcon(product.brand)}
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>Brand</Text>
                  <Text style={styles.metadataValue}>{product.brand || 'Unknown'}</Text>
                </View>
              </View>

              <View style={styles.metadataItem}>
                {getCategoryIcon(product.category)}
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>Category</Text>
                  <Text style={styles.metadataValue}>{product.category || 'Unknown'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.metadataRow}>
              <View style={styles.metadataItem}>
                {getGenderIcon(product.gender)}
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>Gender</Text>
                  <Text style={styles.metadataValue}>{product.gender || 'Unisex'}</Text>
                </View>
              </View>

              <View style={styles.metadataItem}>
                <Icon name="cube-outline" size={22} color={COLORS.primary} />
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>Material</Text>
                  <Text style={styles.metadataValue}>{product.material || 'Unknown'}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />

          {/* Sizes Section */}
          <View style={styles.optionsSection}>
            <Text style={styles.sectionTitle}>Size</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionsScrollContent}
            >
              {Array.isArray(product.size) && product.size.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sizeChip,
                    selectedSize === size && styles.selectedChip,
                  ]}
                  onPress={() => handleSizeSelect(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedChipText,
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Colors Section */}
          <View style={styles.optionsSection}>
            <Text style={styles.sectionTitle}>Color</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionsScrollContent}
            >
              {Array.isArray(product.color) && product.color.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorChip,
                    selectedColor === color && styles.selectedChip,
                  ]}
                  onPress={() => handleColorSelect(color)}
                >
                  <Text style={[
                    styles.colorText,
                    selectedColor === color && styles.selectedChipText,
                  ]}>
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          <View style={styles.divider} />

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {canReview && (
                <TouchableOpacity 
                  style={styles.writeReviewButton}
                  onPress={() => {
                    setIsEditMode(false);
                    setReviewText('');
                    setRating(5);
                    setShowReviewModal(true);
                  }}
                >
                  <Text style={styles.writeReviewButtonText}>Write a Review</Text>
                </TouchableOpacity>
              )}
            </View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : productReviews.length === 0 ? (
              <Text style={styles.noReviewsText}>No reviews yet. Be the first to review this product!</Text>
            ) : (
              productReviews.map((review) => (
                <View key={review._id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUser}>
                      {getUserProfileImage(review) ? (
                        <Image 
                          source={{ uri: getUserProfileImage(review) }} 
                          style={styles.reviewUserImage} 
                        />
                      ) : (
                        <Icon name="account-circle" size={24} color={COLORS.primary} />
                      )}
                      <Text style={styles.reviewUserName}>
                        {getUserDisplayName(review)}
                      </Text>
                      {isCurrentUserReview(review) && (
                        <View style={styles.userBadge}>
                          <Text style={styles.userBadgeText}>You</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.reviewActions}>
                      {isCurrentUserReview(review) && (
                        <>
                          <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleEditReview(review)}
                          >
                            <Feather name="edit-2" size={16} color={COLORS.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleDeleteReview(review._id)}
                          >
                            <Feather name="trash-2" size={16} color={COLORS.error} />
                          </TouchableOpacity>
                        </>
                      )}
                      <Text style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reviewRating}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={styles.reviewText}>{review.reviewText}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={toggleWishlist}
          disabled={loadingWishlist}
        >
          {loadingWishlist ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Icon 
              name={isInWishlist ? "heart" : "heart-outline"} 
              size={24} 
              color={isInWishlist ? COLORS.error : COLORS.primary} 
            />
          )}
        </TouchableOpacity>

        <View style={styles.actionButtonsContainer}>
          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              isOutOfStock && styles.disabledButton,
            ]}
            disabled={isOutOfStock}
            onPress={handleSubmit}
          >
            <Icon name="cart-plus" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>

          {/* Buy Now Button */}
          <TouchableOpacity
            style={[
              styles.buyNowButton,
              isOutOfStock && styles.disabledButton,
            ]}
            disabled={isOutOfStock}
            onPress={() => {
              handleSubmit();
              if (!isOutOfStock) {
                navigation.navigate('Checkout');
              }
            }}
          >
            <Icon name="flash" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>
              {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReviewModal}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditMode ? 'Edit Your Review' : 'Write a Review'}
              </Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <MaterialIcons name="close" size={24} color={COLORS.darkText} />
              </TouchableOpacity>
            </View>

            <Text style={styles.ratingLabel}>Your Rating</Text>
            <View style={styles.ratingSelector}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <AntDesign
                    name={rating >= star ? "star" : "staro"} 
                    size={32} 
                    color={rating >= star ? "#FFD700" : "#CCCCCC"} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.reviewLabel}>Your Review</Text>
            <TextInput
              style={styles.reviewInput}
              multiline
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChangeText={setReviewText}
              maxLength={500}
            />
            <Text style={styles.charCount}>{reviewText.length}/500</Text>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReview}
              disabled={submittingReview}
            >
              {submittingReview ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isEditMode ? 'Update Review' : 'Submit Review'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Global overlay loading indicator for delete operation */}
      {deletingReview && (
        <View style={styles.overlayLoading}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Deleting review...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DisplaySingleProduct;