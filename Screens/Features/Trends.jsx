import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Alert
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomNavigator from "../../Navigators/BottomNavigator";
import { COLORS } from '../../Theme/color';
import baseURL from "../../assets/common/baseurl";
import axios from "axios";
import { ProductCard } from "../../Components/ProductCard";

const { width } = Dimensions.get("window");

const TrendsScreen = ({ navigation }) => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all"); // all, week, month, year
  const [error, setError] = useState(null);

  const fetchTrendingProducts = useCallback(async () => {
    try {
      setError(null);
      console.log(`Making request to: ${baseURL}/api/features/trending?period=${timeFilter}&limit=10`);
      
      // Using axios instead of fetch for better error handling
      const response = await axios.get(
        `${baseURL}/api/features/trending?period=${timeFilter}&limit=10`
      );
      
      console.log("Response received:", response.status);
      
      if (response.data && response.data.success) {
        // Transform trending products to match ProductCard expectations
        const formattedProducts = response.data.trendingProducts.map(item => ({
          _id: item._id,
          name: item.productName,
          price: item.productPrice || item.averagePrice,
          image: [item.productImage], // ProductCard expects an array
          brand: item.brand || "Unknown",
          category: item.category || "Trending", 
          // Add any other required properties
          totalSold: item.totalSold,
          colors: item.colors,
          sizes: item.sizes
        }));
        
        setTrendingProducts(formattedProducts);
      } else {
        setError(response.data?.message || "Failed to load trending products");
      }
    } catch (err) {
      console.error("Trending products fetch error:", err);
      // More detailed error info
      const errorMessage = err.response 
        ? `Error ${err.response.status}: ${err.response.data?.message || err.message}`
        : err.message || "Network error";
      
      setError(errorMessage);
      
      // Alert for debugging in development
      if (__DEV__) {
        Alert.alert(
          "API Error",
          `Error fetching trending products: ${errorMessage}\n\nURL: ${baseURL}/api/features/trending`,
          [{ text: "OK" }]
        );
      }
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

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="trending-up" size={64} color={COLORS.lightGray || "#D1D5DB"} />
      <Text style={styles.emptyText}>No trending products found</Text>
      <Text style={styles.emptySubtext}>
        Products will appear here once they start selling
      </Text>
    </View>
  );

  // Use FlatList with ProductCard component
  const renderProductList = () => (
    <FlatList
      data={trendingProducts}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => (
        <ProductCard item={item} navigation={navigation} />
      )}
      numColumns={2}
      columnWrapperStyle={styles.productRow}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={renderEmptyList}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={[COLORS.primary]} 
        />
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
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger || "#EF4444"} />
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
        renderProductList()
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
    paddingHorizontal: 8,
  },
  productRow: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
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