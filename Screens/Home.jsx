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
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './../Redux/actions/productActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Get screen width to calculate card width
const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

// Color palette (matching the colors used in ProductScreen)
const COLORS = {
  primary: '#944535',
  primaryLight: '#B56E61',
  primaryDark: '#723227',
  white: '#FFFFFF',
  light: '#F8F5F4',
  grey: '#E8E1DF',
  darkGrey: '#9A8D8A',
  text: '#3D2E2A',
  textLight: '#5D4E4A',
  success: '#5A8F72',
  warning: '#EDAF6F',
  danger: '#D35E4D',
  shadow: 'rgba(76, 35, 27, 0.15)',
  gold: '#FFD700',
  navy: '#001F3F'
};

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

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
    switch (brand) {
      case 'nike':
        return <FontAwesome5 name="nike" size={14} color={COLORS.navy} />;
      case 'adidas':
        return <FontAwesome5 name="stripe-s" size={14} color={COLORS.navy} />;
      case 'jordan':
        return <Icon name="basketball" size={14} color={COLORS.navy} />;
      default:
        return <FontAwesome5 name="tag" size={14} color={COLORS.navy} />;
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('DisplaySingleProduct', { product });
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      {/* Product Image */}
      {item.image && item.image.length > 0 ? (
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

      {/* Waterproof Badge if applicable */}
      {item.isWaterproof && (
        <View style={styles.waterproofBadge}>
          <Icon name="water" size={12} color={COLORS.white} />
        </View>
      )}

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.brandRow}>
          {getBrandIcon(item.brand)}
          <Text style={styles.brandText}>{item.brand}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
          </Text>
          
          {parseInt(item.stock) === 0 && (
            <Text style={styles.outOfStockText}>Out of stock</Text>
          )}
        </View>
      </View>

      {/* Category Tag */}
      <View style={styles.categoryTag}>
        <Text style={styles.categoryText}>
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SHOESHABLE</Text>
        <Text style={styles.headerSubtitle}>sapatos</Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ProductScreen')}>
            <Icon name="view-dashboard" size={24} color={COLORS.navy} />
            <Text style={styles.iconText}>Admin</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="cart-outline" size={24} color={COLORS.navy} />
            <Text style={styles.iconText}>Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading shoes...</Text>
        </View>
      ) : (
        <FlatList
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="shoe-sneaker" size={80} color={COLORS.primaryLight} />
              <Text style={styles.emptyText}>No shoes available</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  iconText: {
    fontSize: 14,
    color: COLORS.navy,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textLight,
  },
  productGrid: {
    padding: 12,
    paddingBottom: 24,
  },
  productCard: {
    width: cardWidth,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: 6,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.light,
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  outOfStockText: {
    fontSize: 10,
    color: COLORS.danger,
    fontWeight: '500',
  },
  waterproofBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,31,63,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 12,
  },
});

export default Home;