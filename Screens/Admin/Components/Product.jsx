import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  ScrollView,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchEnumValues,
} from "../../../Redux/actions/productActions";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { styles } from "../../../Styles/product.js";
import { COLORS } from "../../../Theme/color.js";
import {
  getBrandIcon,
  getCategoryIcon,
  getGenderIcon,
} from "../../../Utils/Icons/ProductIcons";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  // Get enum values from Redux state
  const {
    categories: SHOE_CATEGORIES = {},
    brands: SHOE_BRANDS = {},
    sizes: COMMON_SIZES = [],
    colors: COMMON_COLORS = [],
    genders: GENDER_OPTIONS = [],
  } = useSelector((state) => state.product.enumValues || {});

  const enumsLoading = useSelector((state) => state.product.enumsLoading);
  const enumsError = useSelector((state) => state.product.enumsError);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [currentSize, setCurrentSize] = useState("");
  const [currentColor, setCurrentColor] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: [],
    category: "",
    brand: "",
    size: [],
    color: [],
    gender: "",
    material: "",
  });
  useEffect(() => {
    dispatch(fetchEnumValues()).catch((error) => {
      console.error("Failed to fetch enum values:", error);
    });
  }, [dispatch]);
  useEffect(() => {
    if (
      Object.values(SHOE_CATEGORIES).length > 0 &&
      Object.values(SHOE_BRANDS).length > 0 &&
      GENDER_OPTIONS.length > 0
    ) {
      setNewProduct((prev) => ({
        ...prev,
        category: Object.values(SHOE_CATEGORIES)[0],
        brand: Object.values(SHOE_BRANDS)[0],
        gender: GENDER_OPTIONS[0],
      }));
    }
  }, [SHOE_CATEGORIES, SHOE_BRANDS, GENDER_OPTIONS]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (product.brand &&
            product.brand.toLowerCase().includes(searchText.toLowerCase())) ||
          (product.category &&
            product.category.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchText, products]);

  const fetchProducts = useCallback(() => {
    setRefreshing(true);
    dispatch(getProducts())
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.brand ||
      !newProduct.gender ||
      newProduct.size.length === 0 ||
      newProduct.color.length === 0
    ) {
      Alert.alert("Validation Error", "All required fields must be filled");
      return;
    }

    setLoading(true);
    try {
      const imagesBase64 = await Promise.all(
        newProduct.image.map(async (uri) => {
          if (typeof uri === "string" && uri.startsWith("data:image")) {
            return uri;
          }
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          return `data:image/jpeg;base64,${base64}`;
        })
      );

      const productWithBase64Images = {
        ...newProduct,
        image: imagesBase64,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10) || 0,
      };

      await dispatch(addProduct(productWithBase64Images));
      setModalVisible(false);
      resetProductForm();
      fetchProducts();
      Alert.alert("Success", "Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.brand ||
      !newProduct.gender ||
      newProduct.size.length === 0 ||
      newProduct.color.length === 0
    ) {
      Alert.alert("Validation Error", "All required fields must be filled");
      return;
    }

    setLoading(true);
    try {
      // Process images, handling both formats
      const imagesBase64 = await Promise.all(
        newProduct.image.map(async (uri) => {
          // Skip processing if already a base64 string
          if (typeof uri === "string" && uri.startsWith("data:image")) {
            return uri;
          }
          // Handle object format
          if (typeof uri === "object" && uri !== null) {
            if (uri.uri) {
              const base64 = await FileSystem.readAsStringAsync(uri.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              return `data:image/jpeg;base64,${base64}`;
            } else {
              return uri; // Return as is if no uri property
            }
          }
          // Process local file URIs
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${base64}`;
          } catch (e) {
            console.warn("Failed to process image", e);
            return uri; // Return original if processing fails
          }
        })
      );

      const updatedProductWithBase64Images = {
        ...newProduct,
        image: imagesBase64,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10) || 0,
      };

      await dispatch(
        updateProduct(currentProductId, updatedProductWithBase64Images)
      );
      setModalVisible(false);
      setIsEditing(false);
      resetProductForm();
      fetchProducts(); // Refresh products list
      Alert.alert("Success", "Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("Error", "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    if (
      Object.values(SHOE_CATEGORIES).length > 0 &&
      Object.values(SHOE_BRANDS).length > 0 &&
      GENDER_OPTIONS.length > 0
    ) {
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: [],
        category: Object.values(SHOE_CATEGORIES)[0],
        brand: Object.values(SHOE_BRANDS)[0],
        size: [],
        color: [],
        gender: GENDER_OPTIONS[0],
        material: "",
      });
    } else {
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: [],
        category: "",
        brand: "",
        size: [],
        color: [],
        gender: "",
        material: "",
      });
    }

    setCurrentSize("");
    setCurrentColor("");
  };

  const handleSelectImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setNewProduct({
          ...newProduct,
          image: [
            ...newProduct.image,
            ...result.assets.map((asset) => asset.uri),
          ],
        });
      }
    } catch (error) {
      console.error("Error selecting images:", error);
      Alert.alert("Error", "Failed to select images");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...newProduct.image];
    updatedImages.splice(index, 1);
    setNewProduct({ ...newProduct, image: updatedImages });
  };

  const handleAddSize = () => {
    if (currentSize && !newProduct.size.includes(currentSize)) {
      setNewProduct({ ...newProduct, size: [...newProduct.size, currentSize] });
      setCurrentSize("");
    }
  };

  const handleRemoveSize = (size) => {
    setNewProduct({
      ...newProduct,
      size: newProduct.size.filter((s) => s !== size),
    });
  };

  const handleAddColor = () => {
    if (currentColor && !newProduct.color.includes(currentColor)) {
      setNewProduct({
        ...newProduct,
        color: [...newProduct.color, currentColor],
      });
      setCurrentColor("");
    }
  };

  const handleRemoveColor = (color) => {
    setNewProduct({
      ...newProduct,
      color: newProduct.color.filter((c) => c !== color),
    });
  };

  const handleEditProduct = (product) => {
    try {
      // Extract image data from product
      const images =
        product.image && product.image.length > 0
          ? product.image
              .map((img) => {
                if (typeof img === "string") {
                  return img;
                } else if (img && typeof img === "object") {
                  return img.uri || img;
                } else {
                  return "";
                }
              })
              .filter((img) => img)
          : [];

      // Handle size and color arrays
      const sizes = Array.isArray(product.size)
        ? product.size
        : product.size
        ? [product.size]
        : [];

      const colors = Array.isArray(product.color)
        ? product.color
        : product.color
        ? [product.color]
        : [];

      setNewProduct({
        name: product.name || "",
        description: product.description || "",
        price:
          typeof product.price === "number"
            ? product.price.toString()
            : product.price || "",
        stock:
          typeof product.stock === "number"
            ? product.stock.toString()
            : product.stock || "",
        image: images,
        category: product.category || Object.values(SHOE_CATEGORIES)[0] || "",
        brand: product.brand || Object.values(SHOE_BRANDS)[0] || "",
        size: sizes,
        color: colors,
        gender: product.gender || GENDER_OPTIONS[0] || "",
        material: product.material || "",
      });
      setCurrentProductId(product._id);
      setIsEditing(true);
      setModalVisible(true);
    } catch (error) {
      console.error("Error preparing edit form:", error);
      Alert.alert("Error", "Failed to prepare edit form");
    }
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await dispatch(deleteProduct(productId));
              fetchProducts(); // Refresh products list
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Failed to delete product");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Show loading state while fetching enum values
  if (enumsLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            Loading product configurations...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (
    enumsError &&
    (!Object.keys(SHOE_CATEGORIES).length ||
      !Object.keys(SHOE_BRANDS).length ||
      !GENDER_OPTIONS.length)
  ) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={48} color={COLORS.danger} />
          <Text style={styles.errorText}>
            Failed to load product configurations
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(fetchEnumValues())}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productCardHeader}>
        {item.image && item.image.length > 0 ? (
          <Image
            source={{
              uri:
                typeof item.image[0] === "string"
                  ? item.image[0]
                  : item.image[0] && item.image[0].uri
                  ? item.image[0].uri
                  : null,
            }}
            style={styles.productThumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.productThumbnailPlaceholder}>
            <MaterialIcons
              name="image-not-supported"
              size={24}
              color={COLORS.textLight}
            />
          </View>
        )}

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>

          {item.description ? (
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}

          <View style={styles.productMetadata}>
            <View style={styles.metadataItem}>
              {getCategoryIcon(item.category)}
              <Text style={styles.metadataText}>{item.category}</Text>
            </View>

            <View style={styles.metadataItem}>
              {getBrandIcon(item.brand)}
              <Text style={styles.metadataText}>{item.brand}</Text>
            </View>

            <View style={styles.metadataItem}>
              {getGenderIcon(item.gender)}
              <Text style={styles.metadataText}>{item.gender}</Text>
            </View>
          </View>

          <View style={styles.productStats}>
            <View style={styles.priceContainer}>
              <MaterialCommunityIcons
                name="currency-php"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.productPrice}>
                ₱
                {typeof item.price === "number"
                  ? item.price.toFixed(2)
                  : item.price}
              </Text>
            </View>

            <View style={styles.stockContainer}>
              <MaterialCommunityIcons
                name={
                  parseInt(item.stock) > 0
                    ? "package-variant"
                    : "package-variant-closed"
                }
                size={16}
                color={
                  parseInt(item.stock) > 0 ? COLORS.success : COLORS.danger
                }
              />
              <Text
                style={[
                  styles.stockValue,
                  parseInt(item.stock) > 10
                    ? styles.inStock
                    : parseInt(item.stock) > 0
                    ? styles.lowStock
                    : styles.outOfStock,
                ]}
              >
                {item.stock || "0"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Size and Color Chips */}
      <View style={styles.productAttributesContainer}>
        <View style={styles.attributeSection}>
          <Text style={styles.attributeLabel}>Sizes:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.attributeChipsScroll}
          >
            {Array.isArray(item.size) &&
              item.size.map((size, index) => (
                <View key={index} style={styles.attributeChip}>
                  <Text style={styles.attributeChipText}>{size}</Text>
                </View>
              ))}
          </ScrollView>
        </View>

        <View style={styles.attributeSection}>
          <Text style={styles.attributeLabel}>Colors:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.attributeChipsScroll}
          >
            {Array.isArray(item.color) &&
              item.color.map((color, index) => (
                <View key={index} style={styles.attributeChip}>
                  <Text style={styles.attributeChipText}>{color}</Text>
                </View>
              ))}
          </ScrollView>
        </View>
      </View>

      {item.image && item.image.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.additionalImagesContainer}
          contentContainerStyle={styles.additionalImagesContent}
        >
          {item.image.slice(1).map((img, index) => {
            const imageUri =
              typeof img === "string" ? img : img && img.uri ? img.uri : null;
            return imageUri ? (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={styles.additionalImage}
                resizeMode="cover"
              />
            ) : null;
          })}
        </ScrollView>
      )}

      <View style={styles.productIdContainer}>
        <FontAwesome5 name="fingerprint" size={12} color={COLORS.darkGrey} />
        <Text style={styles.productId}>{item._id}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditProduct(item)}
        >
          <Feather name="edit-2" size={16} color={COLORS.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item._id)}
        >
          <Feather name="trash-2" size={16} color={COLORS.danger} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Product Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetProductForm();
              setIsEditing(false);
              setModalVisible(true);
            }}
          >
            <MaterialIcons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color={COLORS.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shoes..."
            placeholderTextColor={COLORS.darkGrey}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x" size={18} color={COLORS.darkGrey} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchProducts}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="shoe-sneaker"
              size={64}
              color={COLORS.primaryLight}
            />
            <Text style={styles.emptyStateText}>No shoes found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchText
                ? "Try a different search term"
                : "Add a new shoe to get started"}
            </Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!loading) setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? "Edit Shoe" : "New Shoe"}
              </Text>
              {!loading && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Feather name="x" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Basic Information */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Basic Information</Text>

                <View style={styles.formGroup}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabel}>Shoe Name</Text>
                    <Text style={styles.requiredMark}>*</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <MaterialIcons
                      name="shopping-bag"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter shoe name"
                      placeholderTextColor={COLORS.darkGrey}
                      value={newProduct.name}
                      onChangeText={(text) =>
                        setNewProduct({ ...newProduct, name: text })
                      }
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Description</Text>
                  <View style={styles.textAreaContainer}>
                    <TextInput
                      style={styles.textArea}
                      placeholder="Enter shoe description"
                      placeholderTextColor={COLORS.darkGrey}
                      value={newProduct.description}
                      onChangeText={(text) =>
                        setNewProduct({ ...newProduct, description: text })
                      }
                      multiline={true}
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View
                    style={[styles.formGroup, { flex: 1, marginRight: 12 }]}
                  >
                    <View style={styles.formLabelContainer}>
                      <Text style={styles.formLabel}>Price</Text>
                      <Text style={styles.requiredMark}>*</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons
                        name="currency-php"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="₱0.00"
                        placeholderTextColor={COLORS.darkGrey}
                        value={newProduct.price}
                        onChangeText={(text) =>
                          setNewProduct({ ...newProduct, price: text })
                        }
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Stock</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons
                        name="package-variant"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor={COLORS.darkGrey}
                        value={newProduct.stock}
                        onChangeText={(text) =>
                          setNewProduct({ ...newProduct, stock: text })
                        }
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Shoe Details */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Shoe Details</Text>

                <View style={styles.formGroup}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabel}>Category</Text>
                    <Text style={styles.requiredMark}>*</Text>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={newProduct.category}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        setNewProduct({ ...newProduct, category: itemValue })
                      }
                    >
                      {Object.values(SHOE_CATEGORIES).map((category) => (
                        <Picker.Item
                          key={category}
                          label={
                            category.charAt(0).toUpperCase() + category.slice(1)
                          }
                          value={category}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabel}>Brand</Text>
                    <Text style={styles.requiredMark}>*</Text>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={newProduct.brand}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        setNewProduct({ ...newProduct, brand: itemValue })
                      }
                    >
                      {Object.values(SHOE_BRANDS).map((brand) => (
                        <Picker.Item
                          key={brand}
                          label={brand.charAt(0).toUpperCase() + brand.slice(1)}
                          value={brand}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabel}>Gender</Text>
                    <Text style={styles.requiredMark}>*</Text>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={newProduct.gender}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        setNewProduct({ ...newProduct, gender: itemValue })
                      }
                    >
                      {GENDER_OPTIONS.map((gender) => (
                        <Picker.Item
                          key={gender}
                          label={
                            gender.charAt(0).toUpperCase() + gender.slice(1)
                          }
                          value={gender}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Material</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="texture-box"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Leather, Canvas, Synthetic"
                      placeholderTextColor={COLORS.darkGrey}
                      value={newProduct.material}
                      onChangeText={(text) =>
                        setNewProduct({ ...newProduct, material: text })
                      }
                    />
                  </View>
                </View>
              </View>

              {/* Sizes */}
              <View style={styles.formSection}>
                <View style={styles.formLabelContainer}>
                  <Text style={styles.formSectionTitle}>Sizes</Text>
                  <Text style={styles.requiredMark}>*</Text>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.addAttributeContainer}>
                    <Picker
                      selectedValue={currentSize}
                      style={[styles.picker, { flex: 1 }]}
                      onValueChange={(itemValue) => setCurrentSize(itemValue)}
                    >
                      <Picker.Item label="Select Size" value="" />
                      {COMMON_SIZES.map((size) => (
                        <Picker.Item key={size} label={size} value={size} />
                      ))}
                    </Picker>
                    <Text style={{ width: 10 }}></Text>
                    <TouchableOpacity
                      style={styles.addAttributeButton}
                      onPress={handleAddSize}
                      disabled={!currentSize}
                    >
                      <Text style={styles.addAttributeButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.orText}>OR</Text>

                  <View style={styles.customSizeContainer}>
                    <TextInput
                      style={styles.customSizeInput}
                      placeholder="Custom size (e.g., EU 42, UK 7.5)"
                      placeholderTextColor={COLORS.darkGrey}
                      value={currentSize}
                      onChangeText={setCurrentSize}
                    />
                    <TouchableOpacity
                      style={styles.addCustomSizeButton}
                      onPress={handleAddSize}
                      disabled={!currentSize}
                    >
                      <Feather name="plus" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>

                  {newProduct.size.length > 0 ? (
                    <View style={styles.selectedAttributesContainer}>
                      {newProduct.size.map((size, index) => (
                        <View key={index} style={styles.selectedAttributeChip}>
                          <Text style={styles.selectedAttributeText}>
                            {size}
                          </Text>
                          <TouchableOpacity
                            style={styles.removeAttributeButton}
                            onPress={() => handleRemoveSize(size)}
                          >
                            <Feather
                              name="x"
                              size={16}
                              color={COLORS.primary}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noAttributesText}>
                      No sizes selected
                    </Text>
                  )}
                </View>
              </View>

              {/* Colors */}
              <View style={styles.formSection}>
                <View style={styles.formLabelContainer}>
                  <Text style={styles.formSectionTitle}>Colors</Text>
                  <Text style={styles.requiredMark}>*</Text>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.addAttributeContainer}>
                    <Picker
                      selectedValue={currentColor}
                      style={[styles.picker, { flex: 1 }]}
                      onValueChange={(itemValue) => setCurrentColor(itemValue)}
                    >
                      <Picker.Item label="Select Color" value="" />
                      {COMMON_COLORS.map((color) => (
                        <Picker.Item key={color} label={color} value={color} />
                      ))}
                    </Picker>
                    <Text style={{ width: 10 }}></Text>
                    <TouchableOpacity
                      style={styles.addAttributeButton}
                      onPress={handleAddColor}
                      disabled={!currentColor}
                    >
                      <Text style={styles.addAttributeButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.orText}>OR</Text>

                  <View style={styles.customSizeContainer}>
                    <TextInput
                      style={styles.customSizeInput}
                      placeholder="Custom color (e.g., Burgundy, Olive)"
                      placeholderTextColor={COLORS.darkGrey}
                      value={currentColor}
                      onChangeText={setCurrentColor}
                    />
                    <TouchableOpacity
                      style={styles.addCustomSizeButton}
                      onPress={handleAddColor}
                      disabled={!currentColor}
                    >
                      <Feather name="plus" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>

                  {newProduct.color.length > 0 ? (
                    <View style={styles.selectedAttributesContainer}>
                      {newProduct.color.map((color, index) => (
                        <View key={index} style={styles.selectedAttributeChip}>
                          <Text style={styles.selectedAttributeText}>
                            {color}
                          </Text>
                          <TouchableOpacity
                            style={styles.removeAttributeButton}
                            onPress={() => handleRemoveColor(color)}
                          >
                            <Feather
                              name="x"
                              size={16}
                              color={COLORS.primary}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noAttributesText}>
                      No colors selected
                    </Text>
                  )}
                </View>
              </View>

              {/* Product Images */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Product Images</Text>
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={handleSelectImages}
                >
                  <Feather name="image" size={20} color={COLORS.white} />
                  <Text style={styles.imagePickerButtonText}>
                    Select Images
                  </Text>
                </TouchableOpacity>

                {newProduct.image && newProduct.image.length > 0 ? (
                  <View style={styles.imagePreviewContainer}>
                    {newProduct.image.map((uri, index) => {
                      const imageUri =
                        typeof uri === "string"
                          ? uri
                          : uri && uri.uri
                          ? uri.uri
                          : null;
                      return imageUri ? (
                        <View key={index} style={styles.imagePreviewWrapper}>
                          <Image
                            source={{ uri: imageUri }}
                            style={styles.imagePreview}
                          />
                          <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => handleRemoveImage(index)}
                          >
                            <Feather name="x" size={12} color={COLORS.white} />
                          </TouchableOpacity>
                        </View>
                      ) : null;
                    })}
                  </View>
                ) : (
                  <View style={styles.noImagesContainer}>
                    <MaterialCommunityIcons
                      name="image-off"
                      size={24}
                      color={COLORS.darkGrey}
                    />
                    <Text style={styles.noImagesText}>No images selected</Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={isEditing ? handleUpdateProduct : handleAddProduct}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditing ? "Update Shoe" : "Add Shoe"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductScreen;
