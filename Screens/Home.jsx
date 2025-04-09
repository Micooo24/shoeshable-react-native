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
  Animated,
  Modal,
  ScrollView,
  TextInput,
  Image,
  Dimensions
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
import { ProductCard } from '../Components/ProductCard';
import { getToken } from '../sqlite_db/Auth';
import baseURL from '../assets/common/baseurl';
import Slider from '@react-native-community/slider'; 
import { addToCart } from '../Redux/actions/cartActions';
import { Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

// Constants for filter options - using the same as in your schema
const SHOE_CATEGORIES = {
  ATHLETIC: 'Athletic',
  RUNNING: 'Running',
  BASKETBALL: 'Basketball',
  CASUAL: 'Casual',
  FORMAL: 'Formal',
  BOOTS: 'Boots',
  SANDALS: 'Sandals',
  SNEAKERS: 'Sneakers',
  HIKING: 'Hiking',
  WALKING: 'Walking',
  TRAINING: 'Training',
  SOCCER: 'Soccer',
  SKATEBOARDING: 'Skateboarding',
  TENNIS: 'Tennis',
  SLIP_ONS: 'Slip-ons'
};

const SHOE_BRANDS = {
  NIKE: 'Nike',
  ADIDAS: 'Adidas',
  PUMA: 'Puma',
  REEBOK: 'Reebok',
  NEW_BALANCE: 'New Balance',
  ASICS: 'Asics',
  CONVERSE: 'Converse',
  VANS: 'Vans',
  UNDER_ARMOUR: 'Under Armour',
  JORDAN: 'Jordan',
  TIMBERLAND: 'Timberland',
  SKECHERS: 'Skechers',
  FILA: 'Fila',
  BROOKS: 'Brooks',
  CROCS: 'Crocs',
  CLARKS: 'Clarks',
  BIRKENSTOCK: 'Birkenstock',
  HOKA: 'Hoka',
  ON_RUNNING: 'On Running',
  SALOMON: 'Salomon'
};

const GENDER_OPTIONS = ['Men', 'Women', 'Unisex', 'Kids'];

const COMMON_COLORS = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
  'Brown', 'Gray', 'Purple', 'Pink', 'Orange', 'Beige', 
  'Tan', 'Navy', 'Teal', 'Gold', 'Silver', 'Multicolor'
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'name_asc', label: 'Name: A to Z' }
];

const MIN_PRICE = 0;
const MAX_PRICE = 100000; // Changed from 1000000 to 100000

const formatPrice = (price) => {
  return `₱${(price/100).toFixed(2)}`;
};

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    gender: '',
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    color: '',
    sort: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filterCount, setFilterCount] = useState(0);
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);

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
        const unreadCount = data.notifications.length;
        setNotificationCount(unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  }, []);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setSelectedColor(null);
    setShowCartModal(true);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const submitToCart = async () => {
    try {
      const tokenData = await getToken();
      const authToken = tokenData?.authToken;

      if (!authToken) {
        Alert.alert('Unauthorized', 'You must be logged in to add items to the cart.');
        return;
      }

      if (!selectedSize || !selectedColor || !selectedProduct) {
        Alert.alert('Error', 'Please select a size and color before adding to cart.');
        return;
      }

      const selectedDetails = {
        productId: selectedProduct._id,
        quantity: 1,
        brand: selectedProduct.brand,
        category: selectedProduct.category,
        size: selectedSize,
        color: selectedColor,
        gender: selectedProduct.gender,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        productImage: selectedProduct.image && selectedProduct.image.length > 0 
          ? selectedProduct.image[0] 
          : null,
      };

      const response = await dispatch(addToCart(selectedDetails));

      if (response?.success) {
        const { cartItem } = response;
        Alert.alert(
          'Success',
          `${cartItem.quantity} ${cartItem.brand} ${cartItem.category} (${cartItem.size}, ${cartItem.color}) added to your cart.`
        );
        setShowCartModal(false);
      } else {
        Alert.alert('Error', response?.message || 'Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const fetchProducts = useCallback(() => {
    setRefreshing(true);
    setIsSearching(false);
    setSearchQuery('');
    setActiveFilter(null);
    
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
        if (Object.keys(appliedFilters).some(key => appliedFilters[key] !== '')) {
          applyFilters();
          return;
        }
        
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
    [dispatch, fetchProducts, appliedFilters]
  );

  // Direct API call for filtering products using query parameters
  const applyFilters = useCallback((filterValues = null) => {
    setLoading(true);
    
    // Use passed filter values or fallback to appliedFilters
    const filtersToApply = filterValues || appliedFilters;
    
    console.log('Raw filters to apply:', filtersToApply);
    
    const queryParams = new URLSearchParams();
    
    // Only add properties that have actual values - matching your MongoDB schema
    if (filtersToApply.category && filtersToApply.category !== '') {
      // Convert UI presentation format to database format
      queryParams.append('category', filtersToApply.category.toLowerCase());
      console.log(`Adding category filter: ${filtersToApply.category.toLowerCase()}`);
    }
    
    if (filtersToApply.brand && filtersToApply.brand !== '') {
      queryParams.append('brand', filtersToApply.brand.toLowerCase());
      console.log(`Adding brand filter: ${filtersToApply.brand.toLowerCase()}`);
    }
    
    if (filtersToApply.gender && filtersToApply.gender !== '') {
      queryParams.append('gender', filtersToApply.gender.toLowerCase());
      console.log(`Adding gender filter: ${filtersToApply.gender.toLowerCase()}`);
    }
    
    if (filtersToApply.color && filtersToApply.color !== '') {
      queryParams.append('color', filtersToApply.color.toLowerCase());
      console.log(`Adding color filter: ${filtersToApply.color.toLowerCase()}`);
    }
    
    // Only add price if it's different from the defaults
    if (filtersToApply.minPrice && filtersToApply.minPrice !== MIN_PRICE) {
      queryParams.append('minPrice', filtersToApply.minPrice);
      console.log(`Adding minPrice filter: ${filtersToApply.minPrice}`);
    }
    
    if (filtersToApply.maxPrice && filtersToApply.maxPrice !== MAX_PRICE) {
      queryParams.append('maxPrice', filtersToApply.maxPrice);
      console.log(`Adding maxPrice filter: ${filtersToApply.maxPrice}`);
    }
    
    if (filtersToApply.sort && filtersToApply.sort !== '') {
      queryParams.append('sort', filtersToApply.sort);
      console.log(`Adding sort option: ${filtersToApply.sort}`);
    }
    
    // Count applied filters (excluding sort)
    const count = Array.from(queryParams.keys()).filter(key => key !== 'sort').length;
    setFilterCount(count);
    
    const queryString = queryParams.toString();
    console.log('Final query string:', queryString);
    
    // Only make API call if there are actual filters to apply
    if (count > 0 || queryParams.has('sort')) {
      // Make direct API call to the endpoint with query parameters
      fetch(`${baseURL}/api/products/filter?${queryString}`)
        .then(response => {
          if (!response.ok) {
            console.log(`API response not OK: ${response.status}`);
            return response.text().then(text => {
              console.log(`Response text: ${text}`);
              throw new Error(`API error: ${response.status} ${text}`);
            });
          }
          return response.json();
        })
        .then(data => {
          // Improved data handling with detailed logging
          console.log('Raw API response:', JSON.stringify(data).substring(0, 200) + '...');
          
          // Normalize data structure - handle all possible response formats
          let productsArray = [];
          
          if (data && Array.isArray(data)) {
            console.log('Response is a direct array');
            productsArray = data;
          } else if (data && data.products && Array.isArray(data.products)) {
            console.log('Response has products array property');
            productsArray = data.products;
          } else if (data && typeof data === 'object') {
            console.log('Response is an object, looking for array property');
            const arrayProps = Object.entries(data).find(([key, value]) => Array.isArray(value));
            if (arrayProps) {
              console.log(`Found array property: ${arrayProps[0]}`);
              productsArray = arrayProps[1];
            }
          }
          
          // Log the normalized results
          console.log(`Normalized ${productsArray.length} products for display`);
          
          // Keep filter count set even if no products returned
          setFilterCount(count);
          
          dispatch({ type: 'GET_PRODUCTS', payload: productsArray });
          setLoading(false);
          setShowFilterModal(false);
        })
        .catch(error => {
          console.error('Error filtering products:', error);
          
          // Client-side filtering as a fallback
          if (products && products.length > 0) {
            console.log('Falling back to client-side filtering');
            
            const filteredProducts = products.filter(product => {
              let matches = true;
              
              if (queryParams.has('category') && 
                  product.category !== queryParams.get('category')) {
                matches = false;
              }
              
              if (queryParams.has('brand') && 
                  product.brand !== queryParams.get('brand')) {
                matches = false;
              }
              
              if (queryParams.has('gender') && 
                  product.gender !== queryParams.get('gender')) {
                matches = false;
              }
              
              if (queryParams.has('color')) {
                const colorFilter = queryParams.get('color');
                // Check if color array includes the filter color
                if (!product.color || !product.color.some(c => 
                    c.toLowerCase() === colorFilter)) {
                  matches = false;
                }
              }
              
              if (queryParams.has('minPrice') && 
                  product.price < Number(queryParams.get('minPrice'))) {
                matches = false;
              }
              
              if (queryParams.has('maxPrice') && 
                  product.price > Number(queryParams.get('maxPrice'))) {
                matches = false;
              }
              
              return matches;
            });
            
            // Apply sorting if needed
            if (queryParams.has('sort')) {
              const sortOption = queryParams.get('sort');
              if (sortOption === 'price_asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
              } else if (sortOption === 'price_desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
              } else if (sortOption === 'name_asc') {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
              } else if (sortOption === 'newest') {
                filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              }
            }
            
            console.log(`Client-side filtering found ${filteredProducts.length} matching products`);
            
            // Even with client-side filtering, maintain filter count to show empty state
            setFilterCount(count);
            dispatch({ type: 'SET_PRODUCTS', payload: filteredProducts });
          } else {
            // If we have no products to filter, set empty results and maintain filter count
            dispatch({ type: 'SET_PRODUCTS', payload: [] });
          }
          
          setLoading(false);
          setShowFilterModal(false);
        });
    } else {
      console.log('No filters to apply, fetching all products');
      // If no actual filters, just get all products
      fetchProducts();
    }
  }, [appliedFilters, dispatch, fetchProducts, products]);

  useEffect(() => {
    fetchProducts();
    fetchNotificationCount();
  }, [fetchProducts, fetchNotificationCount]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleFilterChange = (key, value) => {
    console.log(`Changing filter ${key} to: ${value}`);
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatPriceDisplay = (price) => {
    return `${(price/100).toFixed(2)}`;
  };
  
  const handlePriceRangeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      maxPrice: value
    }));
  };

  const handleApplyFilters = () => {
    // Create a copy of filters, excluding empty values
    const cleanedFilters = {};
    
    Object.keys(filters).forEach(key => {
      // Only include non-empty values
      if (filters[key] !== '' && 
          filters[key] !== null && 
          filters[key] !== undefined &&
          // Special handling for price ranges
          !(key === 'minPrice' && filters[key] === MIN_PRICE) &&
          !(key === 'maxPrice' && filters[key] === MAX_PRICE)) {
        cleanedFilters[key] = filters[key];
      }
    });
    
    console.log('Applying filters:', cleanedFilters);
    
    setAppliedFilters(cleanedFilters);
    applyFilters(cleanedFilters); // Pass the cleaned filters directly
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      category: '',
      brand: '',
      gender: '',
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      color: '',
      sort: ''
    };
    
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setFilterCount(0);
    fetchProducts();
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
    setNotificationCount(0);
  };
  
  const handleExplorePress = () => {
    console.log('Explore collection pressed');
  };

  const renderProductCard = ({ item }) => {
    return (
      <ProductCard 
        item={item} 
        navigation={navigation} 
        onAddToCart={() => handleAddToCart(item)} 
      />
    );
  };
  
  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilterModal}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Products</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterScrollView}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <View style={styles.filterOptionsWrap}>
                {Object.values(SHOE_CATEGORIES).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      filters.category === category && styles.filterChipActive
                    ]}
                    onPress={() => handleFilterChange('category', 
                      filters.category === category ? '' : category)}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        filters.category === category && styles.filterChipTextActive
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Brand Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Brand</Text>
              <View style={styles.filterOptionsWrap}>
                {Object.values(SHOE_BRANDS).map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.filterChip,
                      filters.brand === brand && styles.filterChipActive
                    ]}
                    onPress={() => handleFilterChange('brand', 
                      filters.brand === brand ? '' : brand)}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        filters.brand === brand && styles.filterChipTextActive
                      ]}
                    >
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Gender Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Gender</Text>
              <View style={styles.filterOptionsRow}>
                {GENDER_OPTIONS.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.filterChip,
                      filters.gender === gender && styles.filterChipActive
                    ]}
                    onPress={() => handleFilterChange('gender', 
                      filters.gender === gender ? '' : gender)}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        filters.gender === gender && styles.filterChipTextActive
                      ]}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Color Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Color</Text>
              <View style={styles.filterOptionsWrap}>
                {COMMON_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.filterChip,
                      filters.color === color && styles.filterChipActive
                    ]}
                    onPress={() => handleFilterChange('color', 
                      filters.color === color ? '' : color)}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        filters.color === color && styles.filterChipTextActive
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceSliderContainer}>
                <View style={styles.priceLabels}>
                  <Text style={styles.priceLabel}>{formatPriceDisplay(MIN_PRICE)}</Text>
                  <Text style={styles.priceLabel}>{formatPriceDisplay(filters.maxPrice)}</Text>
                </View>
                <Slider
                  style={styles.priceSlider}
                  minimumValue={MIN_PRICE}
                  maximumValue={MAX_PRICE}
                  value={filters.maxPrice}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.lightGray}
                  thumbTintColor={COLORS.primary}
                  onValueChange={handlePriceRangeChange}
                  step={5000} // Step by ₱50 increments
                />
                <Text style={styles.priceRangeText}>
                  {formatPriceDisplay(MIN_PRICE)} - {formatPriceDisplay(filters.maxPrice)}
                </Text>
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.sortOptionsContainer}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortOption,
                      filters.sort === option.id && styles.sortOptionActive
                    ]}
                    onPress={() => handleFilterChange('sort', 
                      filters.sort === option.id ? '' : option.id)}
                  >
                    <Text 
                      style={[
                        styles.sortOptionText,
                        filters.sort === option.id && styles.sortOptionTextActive
                      ]}
                    >
                      {option.label}
                    </Text>
                    {filters.sort === option.id && (
                      <Ionicons name="checkmark" size={16} color={COLORS.white} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.resetFilterButton} 
              onPress={handleResetFilters}
            >
              <Text style={styles.resetFilterText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyFilterButton} 
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyFilterText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Cart modal component
  const renderCartModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCartModal}
      onRequestClose={() => setShowCartModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add to Cart</Text>
            <TouchableOpacity onPress={() => setShowCartModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
          
          {selectedProduct && (
            <ScrollView style={styles.cartModalScroll}>
              {/* Product Info */}
              <View style={styles.cartProductInfo}>
                <Image 
                  source={{ 
                    uri: selectedProduct.image && selectedProduct.image.length > 0 
                      ? selectedProduct.image[0] 
                      : null 
                  }} 
                  style={styles.cartProductImage} 
                  resizeMode="cover"
                />
                <View style={styles.cartProductDetails}>
                  <Text style={styles.cartProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.cartProductPrice}>₱{formatPriceDisplay(selectedProduct.price)}</Text>
                </View>
              </View>
              
              {/* Sizes Section */}
              <View style={styles.cartOptionsSection}>
                <Text style={styles.cartSectionTitle}>Size</Text>
                <View style={styles.cartOptionsWrap}>
                  {Array.isArray(selectedProduct.size) && selectedProduct.size.map((size, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterChip,
                        selectedSize === size && styles.filterChipActive
                      ]}
                      onPress={() => handleSizeSelect(size)}
                    >
                      <Text 
                        style={[
                          styles.filterChipText,
                          selectedSize === size && styles.filterChipTextActive
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Colors Section */}
              <View style={styles.cartOptionsSection}>
                <Text style={styles.cartSectionTitle}>Color</Text>
                <View style={styles.cartOptionsWrap}>
                  {Array.isArray(selectedProduct.color) && selectedProduct.color.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterChip,
                        selectedColor === color && styles.filterChipActive
                      ]}
                      onPress={() => handleColorSelect(color)}
                    >
                      <Text 
                        style={[
                          styles.filterChipText,
                          selectedColor === color && styles.filterChipTextActive
                        ]}
                      >
                        {color}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}
          
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.cancelCartButton} 
              onPress={() => setShowCartModal(false)}
            >
              <Text style={styles.cancelCartText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addToCartButton} 
              onPress={submitToCart}
            >
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Empty product list component
  const EmptyProductList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="shoe-outline" size={80} color={COLORS.primaryLight} />
      <Text style={styles.emptyTitle}>
        {isSearching 
          ? 'No Matching Products' 
          : filterCount > 0 
            ? 'No Products Match Your Filters' 
            : 'No Products Found'}
      </Text>
      <Text style={styles.emptyText}>
        {isSearching 
          ? `We could not find any products matching "${searchQuery}"`
          : filterCount > 0
            ? "Try adjusting your filters for more results"
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
      ) : filterCount > 0 ? (
        <TouchableOpacity 
          style={styles.resetFilterButton} 
          onPress={handleResetFilters}
        >
          <Ionicons name="refresh" size={16} color={COLORS.white} />
          <Text style={styles.resetFilterText}>Reset Filters</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={fetchProducts}
        >
          <Ionicons name="refresh" size={16} color={COLORS.white} />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
              {isSearching 
                ? 'Searching products...' 
                : filterCount > 0 
                  ? 'Filtering products...' 
                  : 'Discovering your perfect fit...'}
            </Text>
          </View>
        ) : (
          <>
            <Animated.FlatList
              data={products}
              renderItem={renderProductCard}
              keyExtractor={(item) => item._id.toString()}
              numColumns={2}
              contentContainerStyle={[
                styles.productGrid,
                products.length === 0 && { flex: 1, justifyContent: 'center' }
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    fetchProducts();
                    fetchNotificationCount();
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
                  ) : filterCount > 0 ? (
                    <View style={styles.listHeader}>
                      <View style={styles.headerTextContainer}>
                        <Text style={styles.sectionTitle}>Filtered Products</Text>
                        <Text style={styles.sectionSubtitle}>
                          {`Found ${products.length} product${products.length !== 1 ? 's' : ''}`}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.clearFiltersButton} 
                        onPress={handleResetFilters}
                      >
                        <Ionicons name="close-circle" size={16} color={COLORS.primary} />
                        <Text style={styles.clearFiltersText}>Clear Filters</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Banner 
                        onExplorePress={handleExplorePress}
                        colors={[COLORS.primary, '#142030', '#0c1622']}
                      />
                      
                      {/* Filter button moved below banner */}
                      <View style={styles.filterBelowBanner}>
                        <TouchableOpacity 
                          style={[
                            styles.filterButton,
                            filterCount > 0 && styles.filterButtonActive
                          ]} 
                          onPress={() => setShowFilterModal(true)}
                        >
                          <Ionicons 
                            name="filter" 
                            size={18} 
                            color={filterCount > 0 ? COLORS.white : COLORS.primary} 
                          />
                          <Text 
                            style={[
                              styles.filterButtonText,
                              filterCount > 0 && styles.filterButtonTextActive
                            ]}
                          >
                            Filter
                          </Text>
                          {filterCount > 0 && (
                            <View style={styles.filterCountBadge}>
                              <Text style={styles.filterCountText}>{filterCount}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                      
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
              ListEmptyComponent={<EmptyProductList />}
            />
          </>
        )}
      </View>
      
      {/* Cart Modal */}
      {renderCartModal()}
      
      {/* Filter Modal */}
      {renderFilterModal()}
      
      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Home" />
      </View>
    </View>
  );
};

export default Home;