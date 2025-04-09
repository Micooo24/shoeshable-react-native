import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";
import { filterProducts, fetchEnumValues } from "../../Redux/actions/productActions";
import { COLORS } from "../../Styles/profile";

const FilterScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Get enum values and loading state from Redux
  const { enumValues, enumsLoading } = useSelector((state) => state.productReducer);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortOption, setSortOption] = useState("newest");
  
  // State to track if filters are applied
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Fetch enum values on component mount
  useEffect(() => {
    dispatch(fetchEnumValues());
  }, [dispatch]);

  // Apply filters function
  const applyFilters = () => {
    const filters = {
      category: selectedCategory,
      brand: selectedBrand,
      gender: selectedGender,
      color: selectedColor,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sort: sortOption,
    };
    
    // Filter out empty values
    Object.keys(filters).forEach((key) => {
      if (!filters[key] || filters[key] === "") {
        delete filters[key];
      }
    });
    
    // If minPrice is 0 and maxPrice is at maximum, don't include price filter
    if (filters.minPrice === 0 && filters.maxPrice === 300) {
      delete filters.minPrice;
      delete filters.maxPrice;
    }
    
    dispatch(filterProducts(filters));
    setFiltersApplied(true);
    
    // Navigate back to product list with applied filters
    navigation.navigate("Products", { filtersApplied: true });
  };

  // Reset filters function
  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedGender("");
    setSelectedColor("");
    setPriceRange([0, 300]);
    setSortOption("newest");
    setFiltersApplied(false);
    
    // Call API with empty filters to reset
    dispatch(filterProducts({}));
    
    // Navigate back to product list
    navigation.navigate("Products", { filtersApplied: false });
  };

  // Helper function to render filter options
  const renderFilterOptions = (title, options, selectedValue, setSelectedValue) => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedValue === option.value && styles.selectedOption,
              ]}
              onPress={() => setSelectedValue(selectedValue === option.value ? "" : option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedValue === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Format price for display
  const formatPrice = (value) => `$${value}`;

  // Loading state
  if (enumsLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading filter options...</Text>
      </SafeAreaView>
    );
  }

  // Prepare category options
  const categoryOptions = Object.entries(enumValues.categories || {}).map(([key, value]) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value: value,
  }));

  // Prepare brand options
  const brandOptions = Object.entries(enumValues.brands || {}).map(([key, value]) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '),
    value: value,
  }));

  // Prepare gender options
  const genderOptions = (enumValues.genders || []).map((gender) => ({
    label: gender.charAt(0).toUpperCase() + gender.slice(1),
    value: gender,
  }));

  // Prepare color options
  const colorOptions = (enumValues.colors || []).map((color) => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color,
  }));

  // Sort options
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name A-Z", value: "name_asc" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter Products</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        {renderFilterOptions("Categories", categoryOptions, selectedCategory, setSelectedCategory)}

        {/* Brands */}
        {renderFilterOptions("Brands", brandOptions, selectedBrand, setSelectedBrand)}

        {/* Gender */}
        {renderFilterOptions("Gender", genderOptions, selectedGender, setSelectedGender)}

        {/* Colors */}
        {renderFilterOptions("Colors", colorOptions, selectedColor, setSelectedColor)}

        {/* Price Range */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Price Range</Text>
          <View style={styles.priceRangeContainer}>
            <Text style={styles.priceRangeText}>
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={300}
              step={10}
              value={priceRange[1]}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor="#D0D0D0"
              thumbTintColor={COLORS.primary}
              onValueChange={(value) => setPriceRange([priceRange[0], value])}
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={300}
              step={10}
              value={priceRange[0]}
              minimumTrackTintColor="#D0D0D0"
              maximumTrackTintColor={COLORS.primary}
              thumbTintColor={COLORS.primary}
              onValueChange={(value) => {
                // Ensure minPrice doesn't exceed maxPrice
                if (value <= priceRange[1]) {
                  setPriceRange([value, priceRange[1]]);
                }
              }}
            />
            <View style={styles.priceRangeLabels}>
              <Text style={styles.priceRangeLabel}>{formatPrice(0)}</Text>
              <Text style={styles.priceRangeLabel}>{formatPrice(300)}</Text>
            </View>
          </View>
        </View>

        {/* Sort By */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Sort By</Text>
          <View style={styles.sortOptions}>
            {sortOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sortOptionButton,
                  sortOption === option.value && styles.selectedSortOption,
                ]}
                onPress={() => setSortOption(option.value)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortOption === option.value && styles.selectedSortOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 3,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    padding: 5,
  },
  resetText: {
    color: COLORS.white,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  optionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: "#333",
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  priceRangeContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  priceRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  priceRangeLabel: {
    color: "#666",
    fontSize: 12,
  },
  sortOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sortOptionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedSortOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortOptionText: {
    color: "#333",
  },
  selectedSortOptionText: {
    color: COLORS.white,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FilterScreen;