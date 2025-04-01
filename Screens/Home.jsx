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
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './../Redux/actions/productActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import BottomNavigator from '../Navigators/BottomNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../Theme/color.js';
import { styles } from '../Styles/home.js';

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

      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Home" />
      </View>
    </View>
  );
};

export default Home;