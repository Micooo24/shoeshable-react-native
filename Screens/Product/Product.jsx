import React, { useEffect, useState, useCallback } from 'react';
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
  Switch
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../Redux/actions/productActions';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { 
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  Ionicons
} from '@expo/vector-icons';

// Color palette
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
  shadow: 'rgba(76, 35, 27, 0.15)'
};

// Shoe categories and brands
const SHOE_CATEGORIES = {
  ATHLETIC: 'athletic',
  RUNNING: 'running',
  BASKETBALL: 'basketball',
  CASUAL: 'casual',
  FORMAL: 'formal',
  BOOTS: 'boots',
  SANDALS: 'sandals',
  SNEAKERS: 'sneakers',
  HIKING: 'hiking',
  WALKING: 'walking',
  TRAINING: 'training',
  SOCCER: 'soccer',
  SKATEBOARDING: 'skateboarding',
  TENNIS: 'tennis',
  SLIP_ONS: 'slip-ons'
};

const SHOE_BRANDS = {
  NIKE: 'nike',
  ADIDAS: 'adidas',
  PUMA: 'puma',
  REEBOK: 'reebok',
  NEW_BALANCE: 'new-balance',
  ASICS: 'asics',
  CONVERSE: 'converse',
  VANS: 'vans',
  UNDER_ARMOUR: 'under-armour',
  JORDAN: 'jordan',
  TIMBERLAND: 'timberland',
  SKECHERS: 'skechers',
  FILA: 'fila',
  BROOKS: 'brooks',
  CROCS: 'crocs',
  CLARKS: 'clarks',
  BIRKENSTOCK: 'birkenstock',
  HOKA: 'hoka',
  ON_RUNNING: 'on-running',
  SALOMON: 'salomon'
};

const GENDER_OPTIONS = ['men', 'women', 'unisex', 'kids'];

// Common shoe sizes
const COMMON_SIZES = [
  '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', 
  '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'
];

// Common shoe colors
const COMMON_COLORS = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
  'Brown', 'Gray', 'Purple', 'Pink', 'Orange', 'Beige', 
  'Tan', 'Navy', 'Teal', 'Gold', 'Silver', 'Multicolor'
];

const ProductScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Size and color selection states
  const [currentSize, setCurrentSize] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: [],
    category: Object.values(SHOE_CATEGORIES)[0],
    brand: Object.values(SHOE_BRANDS)[0],
    size: [],
    color: [],
    gender: GENDER_OPTIONS[0],
    material: '',
  });

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchText.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchText.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchText, products]);

  const fetchProducts = useCallback(() => {
    setRefreshing(true);
    dispatch(getProducts()).then(() => {
      setRefreshing(false);
    }).catch(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.brand || 
        !newProduct.gender || newProduct.size.length === 0 || newProduct.color.length === 0) {
      Alert.alert('Validation Error', 'All required fields must be filled');
      return;
    }

    setLoading(true);
    try {
      const imagesBase64 = await Promise.all(newProduct.image.map(async (uri) => {
        if (typeof uri === 'string' && uri.startsWith('data:image')) {
          return uri;
        }
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        return `data:image/jpeg;base64,${base64}`;
      }));

      const productWithBase64Images = { 
        ...newProduct, 
        image: imagesBase64,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10) || 0
      };
      
      await dispatch(addProduct(productWithBase64Images));
      setModalVisible(false);
      resetProductForm();
      fetchProducts(); // Refresh products list
      Alert.alert('Success', 'Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.brand || 
        !newProduct.gender || newProduct.size.length === 0 || newProduct.color.length === 0) {
      Alert.alert('Validation Error', 'All required fields must be filled');
      return;
    }

    setLoading(true);
    try {
      // Process images, handling both formats
      const imagesBase64 = await Promise.all(newProduct.image.map(async (uri) => {
        // Skip processing if already a base64 string
        if (typeof uri === 'string' && uri.startsWith('data:image')) {
          return uri;
        }
        // Handle object format
        if (typeof uri === 'object' && uri !== null) {
          if (uri.uri) {
            const base64 = await FileSystem.readAsStringAsync(uri.uri, { encoding: FileSystem.EncodingType.Base64 });
            return `data:image/jpeg;base64,${base64}`;
          } else {
            return uri; // Return as is if no uri property
          }
        }
        // Process local file URIs
        try {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          return `data:image/jpeg;base64,${base64}`;
        } catch (e) {
          console.warn('Failed to process image', e);
          return uri; // Return original if processing fails
        }
      }));

      const updatedProductWithBase64Images = { 
        ...newProduct, 
        image: imagesBase64,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10) || 0
      };
      
      await dispatch(updateProduct(currentProductId, updatedProductWithBase64Images));
      setModalVisible(false);
      setIsEditing(false);
      resetProductForm();
      fetchProducts(); // Refresh products list
      Alert.alert('Success', 'Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: [],
      category: Object.values(SHOE_CATEGORIES)[0],
      brand: Object.values(SHOE_BRANDS)[0],
      size: [],
      color: [],
      gender: GENDER_OPTIONS[0],
      material: '',
    });
    setCurrentSize('');
    setCurrentColor('');
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
        setNewProduct({ ...newProduct, image: [...newProduct.image, ...result.assets.map(asset => asset.uri)] });
      }
    } catch (error) {
      console.error('Error selecting images:', error);
      Alert.alert('Error', 'Failed to select images');
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
      setCurrentSize('');
    }
  };

  const handleRemoveSize = (size) => {
    setNewProduct({
      ...newProduct,
      size: newProduct.size.filter(s => s !== size)
    });
  };

  const handleAddColor = () => {
    if (currentColor && !newProduct.color.includes(currentColor)) {
      setNewProduct({ ...newProduct, color: [...newProduct.color, currentColor] });
      setCurrentColor('');
    }
  };

  const handleRemoveColor = (color) => {
    setNewProduct({
      ...newProduct,
      color: newProduct.color.filter(c => c !== color)
    });
  };

  const handleEditProduct = (product) => {
    try {
      // Extract image data from product
      const images = product.image && product.image.length > 0 
        ? product.image.map(img => {
            if (typeof img === 'string') {
              return img;
            } else if (img && typeof img === 'object') {
              return img.uri || img;
            } else {
              return '';
            }
          }).filter(img => img)
        : [];

      // Handle size and color arrays
      const sizes = Array.isArray(product.size) ? product.size : 
        (product.size ? [product.size] : []);
      
      const colors = Array.isArray(product.color) ? product.color : 
        (product.color ? [product.color] : []);

      setNewProduct({
        name: product.name || '',
        description: product.description || '',
        price: typeof product.price === 'number' ? product.price.toString() : product.price || '',
        stock: typeof product.stock === 'number' ? product.stock.toString() : product.stock || '',
        image: images,
        category: product.category || Object.values(SHOE_CATEGORIES)[0],
        brand: product.brand || Object.values(SHOE_BRANDS)[0],
        size: sizes,
        color: colors,
        gender: product.gender || GENDER_OPTIONS[0],
        material: product.material || '',
      });
      setCurrentProductId(product._id);
      setIsEditing(true);
      setModalVisible(true);
    } catch (error) {
      console.error('Error preparing edit form:', error);
      Alert.alert('Error', 'Failed to prepare edit form');
    }
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await dispatch(deleteProduct(productId));
              fetchProducts(); // Refresh products list
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product');
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'running':
        return <MaterialCommunityIcons name="run" size={16} color={COLORS.primary} />;
      case 'basketball':
        return <MaterialCommunityIcons name="basketball" size={16} color={COLORS.primary} />;
      case 'casual':
        return <FontAwesome5 name="shoe-prints" size={16} color={COLORS.primary} />;
      case 'formal':
        return <MaterialCommunityIcons name="tie" size={16} color={COLORS.primary} />;
      case 'boots':
        return <MaterialCommunityIcons name="boot-outline" size={16} color={COLORS.primary} />;
      case 'sandals':
        return <MaterialCommunityIcons name="shoe-sandal" size={16} color={COLORS.primary} />;
      default:
        return <MaterialCommunityIcons name="shoe-sneaker" size={16} color={COLORS.primary} />;
    }
  };

  const getBrandIcon = (brand) => {
    switch (brand) {
      case 'nike':
        return <FontAwesome5 name="nike" size={16} color={COLORS.primary} />;
      case 'adidas':
        return <FontAwesome5 name="stripe-s" size={16} color={COLORS.primary} />;
      case 'jordan':
        return <MaterialCommunityIcons name="basketball" size={16} color={COLORS.primary} />;
      default:
        return <FontAwesome5 name="tag" size={16} color={COLORS.primary} />;
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'men':
        return <FontAwesome5 name="male" size={16} color={COLORS.primary} />;
      case 'women':
        return <FontAwesome5 name="female" size={16} color={COLORS.primary} />;
      case 'kids':
        return <FontAwesome5 name="child" size={16} color={COLORS.primary} />;
      default:
        return <MaterialCommunityIcons name="gender-male-female" size={16} color={COLORS.primary} />;
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productCardHeader}>
        {item.image && item.image.length > 0 ? (
          <Image 
            source={{ 
              uri: typeof item.image[0] === 'string' 
                ? item.image[0] 
                : (item.image[0] && item.image[0].uri ? item.image[0].uri : null)
            }} 
            style={styles.productThumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.productThumbnailPlaceholder}>
            <MaterialIcons name="image-not-supported" size={24} color={COLORS.textLight} />
          </View>
        )}
        
        <View style={styles.productInfo}>
          
          {item.description ? (
            <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
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
              <MaterialIcons name="attach-money" size={16} color={COLORS.primary} />
              <Text style={styles.productPrice}>
                {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
              </Text>
            </View>
            
            <View style={styles.stockContainer}>
              <MaterialCommunityIcons 
                name={parseInt(item.stock) > 0 ? "package-variant" : "package-variant-closed"} 
                size={16} 
                color={parseInt(item.stock) > 0 ? COLORS.success : COLORS.danger} 
              />
              <Text 
                style={[
                  styles.stockValue, 
                  parseInt(item.stock) > 10 ? styles.inStock : parseInt(item.stock) > 0 ? styles.lowStock : styles.outOfStock
                ]}
              >
                {item.stock || '0'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Size and Color Chips */}
      <View style={styles.productAttributesContainer}>
        <View style={styles.attributeSection}>
          <Text style={styles.attributeLabel}>Sizes:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attributeChipsScroll}>
            {Array.isArray(item.size) && item.size.map((size, index) => (
              <View key={index} style={styles.attributeChip}>
                <Text style={styles.attributeChipText}>{size}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.attributeSection}>
          <Text style={styles.attributeLabel}>Colors:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attributeChipsScroll}>
            {Array.isArray(item.color) && item.color.map((color, index) => (
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
            const imageUri = typeof img === 'string' ? img : (img && img.uri ? img.uri : null);
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Shoe Inventory</Text>
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
            <TouchableOpacity onPress={() => setSearchText('')}>
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
            <MaterialCommunityIcons name="shoe-sneaker" size={64} color={COLORS.primaryLight} />
            <Text style={styles.emptyStateText}>No shoes found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchText ? "Try a different search term" : "Add a new shoe to get started"}
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
                {isEditing ? 'Edit Shoe' : 'New Shoe'}
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
                    <MaterialIcons name="shopping-bag" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter shoe name"
                      placeholderTextColor={COLORS.darkGrey}
                      value={newProduct.name}
                      onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
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
                      onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                      multiline={true}
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>
                
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
                    <View style={styles.formLabelContainer}>
                      <Text style={styles.formLabel}>Price</Text>
                      <Text style={styles.requiredMark}>*</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <MaterialIcons name="attach-money" size={20} color={COLORS.primary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        placeholderTextColor={COLORS.darkGrey}
                        value={newProduct.price}
                        onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                  
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Stock</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="package-variant" size={20} color={COLORS.primary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor={COLORS.darkGrey}
                        value={newProduct.stock}
                        onChangeText={(text) => setNewProduct({ ...newProduct, stock: text })}
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
                      onValueChange={(itemValue) => setNewProduct({ ...newProduct, category: itemValue })}
                    >
                      {Object.values(SHOE_CATEGORIES).map((category) => (
                        <Picker.Item key={category} label={category.charAt(0).toUpperCase() + category.slice(1)} value={category} />
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
                      onValueChange={(itemValue) => setNewProduct({ ...newProduct, brand: itemValue })}
                    >
                      {Object.values(SHOE_BRANDS).map((brand) => (
                        <Picker.Item key={brand} label={brand.charAt(0).toUpperCase() + brand.slice(1)} value={brand} />
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
                      onValueChange={(itemValue) => setNewProduct({ ...newProduct, gender: itemValue })}
                    >
                      {GENDER_OPTIONS.map((gender) => (
                        <Picker.Item key={gender} label={gender.charAt(0).toUpperCase() + gender.slice(1)} value={gender} />
                      ))}
                    </Picker>
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Material</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="texture-box" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Leather, Canvas, Synthetic"
                      placeholderTextColor={COLORS.darkGrey}
                      value={newProduct.material}
                      onChangeText={(text) => setNewProduct({ ...newProduct, material: text })}
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
                          <Text style={styles.selectedAttributeText}>{size}</Text>
                          <TouchableOpacity 
                            style={styles.removeAttributeButton}
                            onPress={() => handleRemoveSize(size)}
                          >
                            <Feather name="x" size={16} color={COLORS.primary} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noAttributesText}>No sizes selected</Text>
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
                          <Text style={styles.selectedAttributeText}>{color}</Text>
                          <TouchableOpacity 
                            style={styles.removeAttributeButton}
                            onPress={() => handleRemoveColor(color)}
                          >
                            <Feather name="x" size={16} color={COLORS.primary} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noAttributesText}>No colors selected</Text>
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
                  <Text style={styles.imagePickerButtonText}>Select Images</Text>
                </TouchableOpacity>
                
                {newProduct.image && newProduct.image.length > 0 ? (
                  <View style={styles.imagePreviewContainer}>
                    {newProduct.image.map((uri, index) => {
                      const imageUri = typeof uri === 'string' ? uri : (uri && uri.uri ? uri.uri : null);
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
                    <MaterialCommunityIcons name="image-off" size={24} color={COLORS.darkGrey} />
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
                    {isEditing ? 'Update Shoe' : 'Add Shoe'}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
    paddingVertical: 4,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  productList: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  productCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productThumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  waterproofBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  waterproofText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  productMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metadataText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  productStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 2,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inStock: {
    color: COLORS.success,
  },
  lowStock: {
    color: COLORS.warning,
  },
  outOfStock: {
    color: COLORS.danger,
  },
  productAttributesContainer: {
    marginBottom: 12,
  },
  attributeSection: {
    marginBottom: 8,
  },
  attributeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  attributeChipsScroll: {
    flexDirection: 'row',
  },
  attributeChip: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  attributeChipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  additionalImagesContainer: {
    marginBottom: 12,
  },
  additionalImagesContent: {
    paddingVertical: 8,
  },
  additionalImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  productIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productId: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: 'rgba(148, 69, 53, 0.1)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: 'rgba(211, 94, 77, 0.1)',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
    maxHeight: '70%',
  },
  formSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    paddingBottom: 16,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  requiredMark: {
    color: COLORS.danger,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 12,
    paddingRight: 12,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  textArea: {
    width: '100%',
    height: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: COLORS.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addAttributeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addAttributeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAttributeButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginVertical: 8,
  },
  customSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customSizeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  addCustomSizeButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAttributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedAttributeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(148, 69, 53, 0.1)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedAttributeText: {
    color: COLORS.primary,
    marginRight: 6,
    fontSize: 14,
  },
  removeAttributeButton: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAttributesText: {
    textAlign: 'center',
    color: COLORS.darkGrey,
    marginTop: 8,
  },
  imagePickerButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imagePickerButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  noImagesContainer: {
    height: 120,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePreviewWrapper: {
    position: 'relative',
    margin: 6,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default ProductScreen;