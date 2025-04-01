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


  const ProductCRUD = () => {
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
      isWaterproof: false
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
        isWaterproof: false
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
          isWaterproof: product.isWaterproof || false
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
  }

