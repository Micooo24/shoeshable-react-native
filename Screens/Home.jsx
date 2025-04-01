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
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './../Redux/actions/productActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import BottomNavigator from '../Navigators/BottomNavigator';
import { LinearGradient } from 'expo-linear-gradient';

// Get screen width to calculate card width
const { width, height } = Dimensions.get('window');
const cardWidth = (width - 50) / 2;

// Simplified color palette based on the requested colors
const COLORS = {
  primary: '#2C3E50',       // Dark blue-gray (main color)
  primaryLight: '#34495e',  // Slightly lighter variant of primary
  primaryDark: '#1a2530',   // Darker variant of primary
  primaryTransparent: 'rgba(44, 62, 80, 0.9)', // Transparent primary
  
  light: '#ECF0F1',         // Light gray (secondary color)
  lightDark: '#BDC3C7',     // Darker variant of light
  lightTransparent: 'rgba(236, 240, 241, 0.9)', // Transparent light
  
  white: '#FFFFFF',
  black: '#000000',
  
  success: '#2ecc71',       // We'll keep these alert colors for functionality
  warning: '#f39c12',
  danger: '#e74c3c',
  
  shadow: 'rgba(44, 62, 80, 0.15)',
};

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));
  
  // Header animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: 'clamp',
  });
  
  const headerTitleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [28, 22],
    extrapolate: 'clamp',
  });
  
  const headerSubtitleOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const fetchProducts = useCallback(() => {
    setRefreshing(true);
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fixed getBrandIcon function with corrected icons
  const getBrandIcon = (brand) => {
    if (!brand) {
      return <Icon name="tag-outline" size={14} color={COLORS.primary} />;
    }
    
    switch (brand.toLowerCase()) {
      case 'nike':
        return <Icon name="check-bold" size={14} color={COLORS.primary} />; // Using check icon instead of nike
      case 'adidas':
        return <Icon name="podium" size={14} color={COLORS.primary} />; // Using podium instead of stripe-s
      case 'jordan':
        return <Icon name="basketball" size={14} color={COLORS.primary} />;
      case 'puma':
        return <Icon name="cat" size={14} color={COLORS.primary} />;
      case 'reebok':
        return <Icon name="delta" size={14} color={COLORS.primary} />;
      case 'converse':
        return <Icon name="star" size={14} color={COLORS.primary} />;
      case 'vans':
        return <Icon name="alpha-v" size={14} color={COLORS.primary} />; // Changed to alpha-v from MaterialCommunityIcons
      case 'asics':
        return <Icon name="run-fast" size={14} color={COLORS.primary} />;
      default:
        return <Icon name="tag-outline" size={14} color={COLORS.primary} />;
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('SingleProduct', { product });
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
            ${typeof item.price === 'number' ? item.price.toFixed(2) : (item.price || 'N/A')}
          </Text>
          
          {/* Cart Button (Replacing In Stock) */}
          <TouchableOpacity style={styles.cartIconButton}>
            <Icon name="cart-plus" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeaderRight = () => (
    <View style={styles.headerIcons}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="search-outline" size={24} color={COLORS.white} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Product')}
      >
        <MaterialIcons name="dashboard" size={22} color={COLORS.white} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.cartButton}>
        <Icon name="cart-outline" size={24} color={COLORS.white} />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryFilterContent}>
        <TouchableOpacity style={[styles.categoryFilterItem, styles.categoryFilterItemActive]}>
          <Icon name="star" size={18} color={COLORS.white} />
          <Text style={styles.categoryFilterTextActive}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryFilterItem}>
          <Icon name="shoe-sneaker" size={18} color={COLORS.primary} />
          <Text style={styles.categoryFilterText}>Sneakers</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryFilterItem}>
          <Ionicons name="football" size={18} color={COLORS.primary} />
          <Text style={styles.categoryFilterText}>Sport</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryFilterItem}>
          <Icon name="shoe-formal" size={18} color={COLORS.primary} />
          <Text style={styles.categoryFilterText}>Formal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryFilterItem}>
          <Icon name="hiking" size={18} color={COLORS.primary} />
          <Text style={styles.categoryFilterText}>Outdoor</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryFilterItem}>
          <Ionicons name="water" size={18} color={COLORS.primary} />
          <Text style={styles.categoryFilterText}>Waterproof</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Animated.Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>
              SHOESHABLE
            </Animated.Text>
            <Animated.Text style={[styles.headerSubtitle, { opacity: headerSubtitleOpacity }]}>
              Premium Footwear Collection
            </Animated.Text>
          </View>
          
          {renderHeaderRight()}
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Discovering your perfect fit...</Text>
          </View>
        ) : (
          <>
            {/* Category Filter */}
            {renderCategoryFilter()}
            
            {/* Product List */}
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
                    <Text style={styles.sectionTitle}>Featured Collection</Text>
                    <Text style={styles.sectionSubtitle}>
                      Discover the perfect fit for your lifestyle
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <MaterialIcons name="arrow-forward-ios" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="shoe-sneaker" size={80} color={COLORS.primaryLight} />
                  <Text style={styles.emptyTitle}>No Products Found</Text>
                  <Text style={styles.emptyText}>
                    We couldn't find any products that match your criteria
                  </Text>
                  <TouchableOpacity style={styles.refreshButton} onPress={fetchProducts}>
                    <Ionicons name="refresh" size={16} color={COLORS.white} />
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </>
        )}
      </View>
      
      {/* Bottom Navigator */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Home" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.lightDark,
    letterSpacing: 1,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  cartButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryFilterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 5,
  },
  categoryFilterContent: {
    paddingHorizontal: 10,
  },
  categoryFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: COLORS.light,
  },
  categoryFilterItemActive: {
    backgroundColor: COLORS.primary,
  },
  categoryFilterText: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryFilterTextActive: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.primaryLight,
    marginTop: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.light,
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  productGrid: {
    padding: 10,
    paddingBottom: 100, // Added extra padding for bottom navigator
  },
  productCard: {
    width: cardWidth,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    margin: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: 'relative',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 220, // Increased from 180 to 220
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'column',
  },
  waterproofBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryTransparent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productInfo: {
    padding: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    marginLeft: 6,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cartIconButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.primaryLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    zIndex: 1000,
  }
});

export default Home;