import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomNavigator from "../../Navigators/BottomNavigator";
import { COLORS } from '../../Theme/color';
import baseURL from "../../assets/common/baseurl";

const { width } = Dimensions.get("window");
const cardWidth = width / 2 - 25;

const TrendsScreen = ({ navigation }) => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [error, setError] = useState(null);

  const fetchTrendingProducts = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(
        `${baseURL}/trending?period=${timeFilter}&limit=10`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch trending products");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTrendingProducts(data.trendingProducts);
      } else {
        setError(data.message || "Failed to load trending products");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeFilter]);

  useEffect(() => {
    fetchTrendingProducts();
  }, [fetchTrendingProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTrendingProducts();
  }, [fetchTrendingProducts]);

  const renderFilterButton = (label, value) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        timeFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => setTimeFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          timeFilter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item, index }) => {
    // Calculate badge text based on index
    let badgeText = "";
    let badgeStyle = {};
    
    if (index === 0) {
      badgeText = "Best Seller";
      badgeStyle = { backgroundColor: "#FFD700" };
    } else if (index === 1) {
      badgeText = "Popular";
      badgeStyle = { backgroundColor: "#C0C0C0" };
    } else if (index === 2) {
      badgeText = "Hot Item";
      badgeStyle = { backgroundColor: "#CD7F32" };
    }

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate("ProductDetail", { id: item._id })}
      >
        {badgeText && (
          <View style={[styles.badge, badgeStyle]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
        <Image
          source={{ uri: item.productImage }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.productName}
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.totalSold}</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ₱{item.averagePrice?.toFixed(0) || item.productPrice}
              </Text>
              <Text style={styles.statLabel}>Price</Text>
            </View>
          </View>
          
          <View style={styles.colorsContainer}>
            {item.colors?.slice(0, 3).map((color, idx) => (
              <View
                key={`${color}-${idx}`}
                style={[
                  styles.colorDot,
                  { backgroundColor: color.toLowerCase() === "white" ? "#F8F8F8" : color.toLowerCase() }
                ]}
              />
            ))}
            {(item.colors?.length > 3) && (
              <Text style={styles.moreColorsText}>+{item.colors.length - 3}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="trending-up" size={64} color={COLORS.lightGray} />
      <Text style={styles.emptyText}>No trending products found</Text>
      <Text style={styles.emptySubtext}>
        Products will appear here once they start selling
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Trending Now</Text>
          <Ionicons name="trending-up" size={24} color="white" />
        </View>
        <Text style={styles.headerSubtitle}>See what's popular in our store</Text>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton("All Time", "all")}
        {renderFilterButton("This Week", "week")}
        {renderFilterButton("This Month", "month")}
        {renderFilterButton("This Year", "year")}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTrendingProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading trending products...</Text>
        </View>
      ) : (
        <FlatList
          data={trendingProducts}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderProductCard}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Top Products
              </Text>
              <Text style={styles.sectionSubtitle}>
                Based on {timeFilter === "all" ? "all time" : timeFilter} sales
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Trends" />
      </View>
    </View>
  );
};

export default TrendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterButtonTextActive: {
    color: "white",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  listContainer: {
    paddingBottom: 80,
  },
  productRow: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productCard: {
    width: cardWidth,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  productImage: {
    width: "100%",
    height: 160,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
    height: 40,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    height: 24,
    width: 1,
    backgroundColor: "#E5E7EB",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  colorsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  moreColorsText: {
    fontSize: 11,
    color: "#6B7280",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1F2937",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
});