import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Animated,
  ScrollView,
  TextInput
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, searchProducts } from './../Redux/actions/productActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import BottomNavigator from '../Navigators/BottomNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../Theme/color.js';
import { styles } from '../Styles/home.js';
import { debounce } from 'lodash'; // Make sure to import lodash
import { getBrandIcon, getCategoryIcon, getGenderIcon } from '../Utils/Icons/ProductIcons';

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const fetchProducts = useCallback(() => {
    setRefreshing(true);
    setIsSearching(false);
    setSearchQuery('');
    dispatch(getProducts())
      .then(() => {
        setRefreshing(false);
        setLoading(false);
      })
      .catch(() => {
        setRefreshing(false);
        setLoading(false);
      });
  }, [dispatch]);

  const handleSearch = useCallback(
    debounce((query) => {
      if (query.trim() === '') {
        fetchProducts();
        return;
      }
      
      setIsSearching(true);
      setLoading(true);
      
      dispatch(searchProducts({ query }))
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 500),
    [dispatch, fetchProducts]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleProductPress = (product) => {
    navigation.navigate('SingleProduct', { 
      slug: product.slug || product._id, 
      previewData: {
        name: product.name,
        price: product.price,
        description: product.description,
        brand: product.brand,
        category: product.category,
        size: product.size && Array.isArray(product.size) ? product.size : [],
        color: product.color && Array.isArray(product.color) ? product.color : [],
        image: product.image && Array.isArray(product.image) ? product.image : [],
        stock: product.stock
      }
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Handle notification press
  const handleNotificationPress = () => {
    setNotificationCount(0);
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      {/* Product Image Container - Only displaying first image */}
      <View style={styles.imageContainer}>
        {item.image && Array.isArray(item.image) && item.image.length > 0 ? (
          <Image
            source={{
              uri: typeof item.image[0] === 'string' 
                ? item.image[0] 
                : (item.image[0] && item.image[0].uri ? item.image[0].uri : null)
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="shoe-sneaker" size={48} color={COLORS.primaryLight} />
          </View>
        )}

        {/* Gradient overlay on image */}
        <LinearGradient
          colors={['transparent', 'rgba(44, 62, 80, 0.7)']}
          style={styles.imageGradient}
        />

        {/* Badges Container */}
        <View style={styles.badgeContainer}>
          {/* Waterproof Badge if applicable */}
          {item.isWaterproof && (
            <View style={styles.waterproofBadge}>
              <Icon name="water" size={12} color={COLORS.white} />
              <Text style={styles.badgeText}>WP</Text>
            </View>
          )}
          
          {/* Category Badge */}
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        {/* Brand Row */}
        <View style={styles.brandRow}>
          {getBrandIcon(item.brand)}
          <Text style={styles.brandText}>{item.brand || 'Unknown'}</Text>
        </View>
        
        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={1}>
          {item.name || 'Unnamed Product'}
        </Text>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          {/* Price */}
          <Text style={styles.priceText}>
            ₱{typeof item.price === 'number' ? item.price.toFixed(2) : (item.price || 'N/A')}
          </Text>
          <TouchableOpacity style={styles.cartIconButton}>
            <Icon name="cart-plus" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSearchBar = () => (
    <Animated.View 
      style={[
        styles.searchBarContainer,
        {
          opacity: searchBarOpacity,
          transform: [{ 
            translateY: scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: [0, -5],
              extrapolate: 'clamp',
            })
          }]
        }
      ]}
    >
      <View style={styles.searchBarWrapper}>
        <Animated.View 
          style={[
            styles.searchInputContainer,
            {
              flex: 1,
              marginRight: 12,
              transform: [{ 
                scale: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [1, 0.98],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}
        >
          <Feather 
            name="search" 
            size={22} 
            color={searchFocused ? COLORS.primary : '#7f8c8d'} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for shoes, brands, categories..."
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={handleClearSearch}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={16} color="#7f8c8d" />
            </TouchableOpacity>
          )}
        </Animated.View>
        
        {/* Notification Icon */}
        <Animated.View 
          style={[
            styles.notificationContainer,
            {
              transform: [{ 
                scale: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [1, 0.98],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="notifications" 
              size={24} 
              color={COLORS.primary} 
            />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Search Bar */}
      {renderSearchBar()}
      
      <View style={[styles.mainContent, { paddingTop: 60 }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>
              {isSearching ? 'Searching products...' : 'Discovering your perfect fit...'}
            </Text>
          </View>
        ) : (
          <>
            <Animated.FlatList
              data={products}
              renderItem={renderProductCard}
              keyExtractor={(item) => item._id.toString()}
              numColumns={2}
              contentContainerStyle={styles.productGrid}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchProducts}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              ListHeaderComponent={
                <View style={styles.listHeader}>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.sectionTitle}>
                      {isSearching ? 'Search Results' : 'Featured Collection'}
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                      {isSearching 
                        ? `Found ${products.length} product${products.length !== 1 ? 's' : ''}`
                        : 'Discover the perfect fit for your lifestyle'
                      }
                    </Text>
                  </View>
                  {!isSearching && (
                    <TouchableOpacity style={styles.viewAllButton}>
                      <Text style={styles.viewAllText}>View All</Text>
                      <MaterialIcons name="arrow-forward-ios" size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="shoe-sneaker" size={80} color={COLORS.primaryLight} />
                  <Text style={styles.emptyTitle}>
                    {isSearching ? 'No Matching Products' : 'No Products Found'}
                  </Text>
                  <Text style={styles.emptyText}>
                    {isSearching 
                      ? `We could not find any products matching "${searchQuery}"`
                      : 'We could not find any products that match your criteria'
                    }
                  </Text>
                  {isSearching ? (
                    <TouchableOpacity 
                      style={styles.clearSearchButton} 
                      onPress={handleClearSearch}
                    >
                      <Ionicons name="close-circle-outline" size={16} color={COLORS.white} />
                      <Text style={styles.clearSearchText}>Clear Search</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchProducts}>
                      <Ionicons name="refresh" size={16} color={COLORS.white} />
                      <Text style={styles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
            />
          </>
        )}
      </View>

      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Home" />
      </View>
    </View>
  );
};

export default Home;