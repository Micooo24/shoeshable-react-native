// Screens/Home.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Animated
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, searchProducts } from './../Redux/actions/productActions';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigator from '../Navigators/BottomNavigator';
import { COLORS } from '../Theme/color.js';
import { styles } from '../Styles/home.js';
import { debounce } from 'lodash';
import { Banner } from '../Components/Banner';
import { SearchBar } from '../Components/SearchBar';
import { ProductCard } from '../Components/ProductCard'; // Import the ProductCard component
import { getToken } from '../sqlite_db/Auth'; // Import getToken for authentication
import baseURL from '../assets/common/baseurl'; // Import your API base URL

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch notification count from backend
  const fetchNotificationCount = useCallback(async () => {
    try {
      const auth = await getToken();
      if (!auth) return;
      
      const response = await fetch(`${baseURL}/api/orders/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.authToken}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        // Count only unread notifications if your API provides read status
        const unreadCount = data.notifications.length;
        setNotificationCount(unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  }, []);

  const fetchProducts = useCallback(() => {
    setRefreshing(true);
    setIsSearching(false);
    setSearchQuery('');
    // Reset category indicator
    setSelectedCategory(null);
    
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
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigation.navigate('FilteredProduct', { category });
  };

  useEffect(() => {
    fetchProducts();
    fetchNotificationCount(); // Fetch notification count when component mounts
  }, [fetchProducts, fetchNotificationCount]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleNotificationPress = () => {
    // Navigate to notifications screen
    navigation.navigate('Notification');
    // Reset notification count if needed
    setNotificationCount(0);
  };
  
  const handleExplorePress = () => {
    console.log('Explore collection pressed');
  };
  
  const renderProductCard = ({ item }) => {
    console.log('Product Image Data:', {
      productId: item._id,
      productName: item.name,
      imageUrl: item.image && item.image[0], 
      imageName: item.image && item.image[0]?.split('/').pop(), // Extract filename
      imageCount: item.image ? item.image.length : 0,
      sizes: item.size || 'No size information'
    });
    
    const adaptedItem = {
      ...item,
      // If your ProductCard expects images[].url format, convert here
      images: item.image ? item.image.map(url => ({ url })) : [],
      // Add mainImage property for easier access
      mainImage: item.image && item.image[0]
    };
    
    return <ProductCard item={adaptedItem} navigation={navigation} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Search Bar Component */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        onNotificationPress={handleNotificationPress}
        scrollY={scrollY}
        notificationCount={notificationCount}
        colors={COLORS}
      />
      
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
                  onRefresh={() => {
                    fetchProducts();
                    fetchNotificationCount(); // Also refresh notification count
                  }}
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
                <>
                  {isSearching ? (
                    <View style={styles.listHeader}>
                      <View style={styles.headerTextContainer}>
                        <Text style={styles.sectionTitle}>Search Results</Text>
                        <Text style={styles.sectionSubtitle}>
                          {`Found ${products.length} product${products.length !== 1 ? 's' : ''}`}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <>
                      <Banner 
                        onExplorePress={handleExplorePress}
                        colors={[COLORS.primary, '#142030', '#0c1622']}
                      />
                      <View style={styles.listHeader}>
                        <View style={styles.headerTextContainer}>
                          <Text style={styles.sectionTitle}>Featured Products</Text>
                          <Text style={styles.sectionSubtitle}>
                            {`${products.length} product${products.length !== 1 ? 's' : ''} available`}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="shoe-sneaker" size={80} color={COLORS.primaryLight} />
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