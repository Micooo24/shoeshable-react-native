import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import baseURL from '../../../assets/common/baseurl';
import { getToken } from '../../../sqlite_db/Auth';

const Promotions = ({ navigation }) => {
  // State
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Product picker state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Form state
  const [currentId, setCurrentId] = useState(null);
  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [imageUrl, setImageUrl] = useState('');
  
  // Format date to yyyy-mm-dd
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Parse date string to Date object
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-').map(num => parseInt(num));
    return new Date(year, month - 1, day);
  };
  
  // Format price from cents to dollars
  const formatPrice = (price) => {
    return `₱${(price / 100).toFixed(2)}`;
  };
  
  // Axios instance with auth
  const getAxiosInstance = async () => {
    const auth = await getToken();
    if (!auth) return null;
    
    return axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.authToken}`
      }
    });
  };
  
  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const api = await getAxiosInstance();
      if (!api) {
        setLoadingProducts(false);
        return;
      }
      
      const response = await api.get('/api/products/get-products');
      setProducts(response.data.products);
      setLoadingProducts(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products');
      setLoadingProducts(false);
    }
  };
  
  // Fetch all promotions
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const api = await getAxiosInstance();
      if (!api) {
        setLoading(false);
        return;
      }
      
      const response = await api.get('/api/promotions/all');
      setPromotions(response.data.promotions);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      Alert.alert('Error', 'Failed to fetch promotions');
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Create promotion
  const createPromotion = async () => {
    if (!validateForm()) return;
    
    try {
      const api = await getAxiosInstance();
      if (!api) return;
      
      const promotionData = {
        product: productId,
        title,
        description,
        discountPercentage: parseInt(discountPercentage),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        imageUrl: selectedProduct ? selectedProduct.image[0] : imageUrl
      };
      
      await api.post('/api/promotions/create', promotionData);
      Alert.alert('Success', 'Promotion created successfully');
      resetForm();
      setModalVisible(false);
      fetchPromotions();
    } catch (error) {
      console.error('Error creating promotion:', error);
      Alert.alert('Error', 'Failed to create promotion');
    }
  };
  
  // Update promotion
  const updatePromotion = async () => {
    if (!validateForm() || !currentId) return;
    
    try {
      const api = await getAxiosInstance();
      if (!api) return;
      
      const promotionData = {
        title,
        description,
        discountPercentage: parseInt(discountPercentage),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        imageUrl: selectedProduct ? selectedProduct.image[0] : imageUrl
      };
      
      await api.put(`/api/promotions/update/${currentId}`, promotionData);
      Alert.alert('Success', 'Promotion updated successfully');
      resetForm();
      setModalVisible(false);
      fetchPromotions();
    } catch (error) {
      console.error('Error updating promotion:', error);
      Alert.alert('Error', 'Failed to update promotion');
    }
  };
  
  // Delete promotion
  const deletePromotion = async (id) => {
    try {
      const api = await getAxiosInstance();
      if (!api) return;
      
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this promotion?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
              await api.delete(`/api/promotions/delete/${id}`);
              Alert.alert('Success', 'Promotion deleted successfully');
              fetchPromotions();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting promotion:', error);
      Alert.alert('Error', 'Failed to delete promotion');
    }
  };
  
  // Send notifications for selected promotions
  const sendNotifications = async () => {
    if (selectedPromotions.length === 0) {
      Alert.alert('Error', 'Please select at least one promotion');
      return;
    }
    
    try {
      setSending(true);
      const api = await getAxiosInstance();
      if (!api) {
        setSending(false);
        return;
      }
      
      await api.post('/api/promotions/send-notifications', { 
        promotionIds: selectedPromotions 
      });
      
      Alert.alert('Success', 'Notifications sent successfully');
      setSelectMode(false);
      setSelectedPromotions([]);
      setSending(false);
    } catch (error) {
      console.error('Error sending notifications:', error);
      Alert.alert('Error', 'Failed to send notifications');
      setSending(false);
    }
  };
  
  // Toggle promotion selection
  const toggleSelection = (id) => {
    if (selectedPromotions.includes(id)) {
      setSelectedPromotions(selectedPromotions.filter(item => item !== id));
    } else {
      setSelectedPromotions([...selectedPromotions, id]);
    }
  };
  
  // Open edit modal
  const openEditModal = (promotion) => {
    setCurrentId(promotion._id);
    setProductId(promotion.product._id);
    
    // Find and set the selected product
    const product = products.find(p => p._id === promotion.product._id);
    if (product) {
      setSelectedProduct(product);
    } else {
      // If product isn't in the list yet, we'll set it once products are fetched
      setSelectedProduct(null);
    }
    
    setTitle(promotion.title);
    setDescription(promotion.description);
    setDiscountPercentage(promotion.discountPercentage.toString());
    setStartDate(parseDate(promotion.startDate.substring(0, 10)));
    setEndDate(parseDate(promotion.endDate.substring(0, 10)));
    setImageUrl(promotion.imageUrl || '');
    
    setEditMode(true);
    setModalVisible(true);
  };
  
  // Handle date changes
  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  
  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  
  // Select product
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProductId(product._id);
    
    // Use product image as promotion image if none set
    if (!imageUrl && product.image && product.image.length > 0) {
      setImageUrl(product.image[0]);
    }
    
    setShowProductPicker(false);
  };
  
  // Validate form
  const validateForm = () => {
    if (!productId || !title || !description || !discountPercentage || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    
    if (startDate > endDate) {
      Alert.alert('Error', 'End date must be after start date');
      return false;
    }
    
    return true;
  };
  
  // Reset form
  const resetForm = () => {
    setCurrentId(null);
    setProductId('');
    setSelectedProduct(null);
    setTitle('');
    setDescription('');
    setDiscountPercentage('');
    setStartDate(new Date());
    setEndDate(new Date());
    setImageUrl('');
    setEditMode(false);
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchPromotions();
  }, []);
  
  // Fetch products when modal opens
  useEffect(() => {
    if (modalVisible) {
      fetchProducts();
    }
  }, [modalVisible]);
  
  // When products are loaded, try to set the selected product for edit mode
  useEffect(() => {
    if (editMode && productId && products.length > 0 && !selectedProduct) {
      const product = products.find(p => p._id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [products, editMode, productId]);
  
  // Render promotion item
  const renderPromotionItem = (item) => (
    <View key={item._id} style={styles.promotionItem}>
      {selectMode ? (
        <TouchableOpacity 
          style={[
            styles.checkbox, 
            selectedPromotions.includes(item._id) && styles.checkboxSelected
          ]}
          onPress={() => toggleSelection(item._id)}
        >
          {selectedPromotions.includes(item._id) && (
            <Ionicons name="checkmark" size={16} color="#FFF" />
          )}
        </TouchableOpacity>
      ) : null}
      
      <View style={styles.promotionContent}>
        <Text style={styles.promotionTitle}>{item.title}</Text>
        <Text style={styles.promotionInfo}>
          Product: {item.product.name} - {item.discountPercentage}% off
        </Text>
        <Text numberOfLines={2} style={styles.promotionDesc}>
          {item.description}
        </Text>
        <Text style={styles.promotionDates}>
          {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
        </Text>
      </View>
      
      {!selectMode && (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <Ionicons name="create-outline" size={22} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletePromotion(item._id)}>
            <Ionicons name="trash-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  // Header component 
  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Promotions</Text>
      {!selectMode ? (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setSelectMode(true)}
          >
            <Text style={styles.buttonText}>Send Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.addButton]}
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Add New</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              setSelectMode(false);
              setSelectedPromotions([]);
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.addButton, sending && styles.disabledButton]}
            onPress={sendNotifications}
            disabled={sending}
          >
            <Text style={styles.buttonText}>
              {sending ? 'Sending...' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  // Product Selector Modal
  const ProductSelectorModal = () => (
    <Modal
      visible={showProductPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowProductPicker(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select a Product</Text>
            <TouchableOpacity onPress={() => setShowProductPicker(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {loadingProducts ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productItem}
                  onPress={() => handleSelectProduct(item)}
                >
                  <Image 
                    source={{ uri: item.image[0] }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                    <Text style={[
                      styles.productStock,
                      item.stock === 0 && styles.outOfStock
                    ]}>
                      {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                    </Text>
                  </View>
                  {item._id === productId && (
                    <Ionicons name="checkmark-circle" size={24} color="#3498db" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.productList}
              contentContainerStyle={styles.productListContent}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2c3e50" barStyle="light-content" />
      <View style={styles.container}>
        <Header />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchPromotions();
              }}
              colors={["#3498db"]}
            />
          }
        >
          <View style={styles.list}>
            {loading ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Loading promotions...</Text>
              </View>
            ) : promotions.length > 0 ? (
              promotions.map(renderPromotionItem)
            ) : (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No promotions found</Text>
                <TouchableOpacity 
                  style={styles.button}
                  onPress={fetchPromotions}
                >
                  <Text style={styles.buttonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Add/Edit Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editMode ? 'Edit Promotion' : 'Add New Promotion'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.form}>
                <Text style={styles.label}>Product</Text>
                <TouchableOpacity 
                  style={styles.productSelectorButton}
                  onPress={() => setShowProductPicker(true)}
                >
                  {selectedProduct ? (
                    <View style={styles.selectedProductContainer}>
                      <Image 
                        source={{ uri: selectedProduct.image[0] }}
                        style={styles.selectedProductImage}
                        resizeMode="cover"
                      />
                      <View style={styles.selectedProductInfo}>
                        <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
                        <Text style={styles.selectedProductPrice}>
                          {formatPrice(selectedProduct.price)}
                        </Text>
                      </View>
                      <Ionicons name="chevron-down" size={20} color="#777" />
                    </View>
                  ) : (
                    <View style={styles.selectProductPrompt}>
                      <Text style={styles.selectProductText}>Select a product</Text>
                      <Ionicons name="chevron-down" size={20} color="#777" />
                    </View>
                  )}
                </TouchableOpacity>
                
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter promotion title"
                />
                
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter description"
                  multiline
                />
                
                <Text style={styles.label}>Discount Percentage</Text>
                <TextInput
                  style={styles.input}
                  value={discountPercentage}
                  onChangeText={setDiscountPercentage}
                  placeholder="Enter discount percentage"
                  keyboardType="numeric"
                />
                
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {formatDate(startDate)}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#3498db" />
                </TouchableOpacity>
                
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}
                
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {formatDate(endDate)}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#3498db" />
                </TouchableOpacity>
                
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onEndDateChange}
                    minimumDate={startDate}
                  />
                )}
                
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={editMode ? updatePromotion : createPromotion}
                >
                  <Text style={styles.submitButtonText}>
                    {editMode ? 'Update Promotion' : 'Create Promotion'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
        
        {/* Product Selector Modal */}
        <ProductSelectorModal />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 33,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  button: {
    padding: 8,
    backgroundColor: '#34495e',
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#3498db',
  },
  disabledButton: {
    opacity: 0.7,
  },
  list: {
    padding: 12,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  promotionItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3498db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3498db',
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promotionInfo: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 4,
  },
  promotionDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  promotionDates: {
    fontSize: 12,
    color: '#777',
  },
  actionButtons: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  datePickerButtonText: {
    color: '#333',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Product Selector Styles
  productSelectorButton: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  selectProductPrompt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectProductText: {
    color: '#777',
    fontSize: 16,
  },
  selectedProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedProductImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  selectedProductInfo: {
    flex: 1,
  },
  selectedProductName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  selectedProductPrice: {
    fontSize: 14,
    color: '#3498db',
  },
  productList: {
    maxHeight: 400,
  },
  productListContent: {
    padding: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 12,
    color: '#777',
  },
  outOfStock: {
    color: '#e74c3c',
  }
});

export default Promotions;