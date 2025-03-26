import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Shop = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock categories
  const categories = ['All', 'Sneakers', 'Running', 'Basketball', 'Casual'];

  // Mock products data
  const mockProducts = [
    {
      id: '1',
      name: 'Nike Air Max 270',
      price: 150,
      image: 'https://via.placeholder.com/150',
      category: 'Sneakers',
    },
    {
      id: '2',
      name: 'Adidas Ultraboost',
      price: 180,
      image: 'https://via.placeholder.com/150',
      category: 'Running',
    },
    {
      id: '3',
      name: 'Jordan Retro 4',
      price: 200,
      image: 'https://via.placeholder.com/150',
      category: 'Basketball',
    },
    {
      id: '4',
      name: 'Converse Chuck Taylor',
      price: 60,
      image: 'https://via.placeholder.com/150',
      category: 'Casual',
    },
    {
      id: '5',
      name: 'Puma RS-X',
      price: 110,
      image: 'https://via.placeholder.com/150',
      category: 'Sneakers',
    },
    {
      id: '6',
      name: 'New Balance 990',
      price: 175,
      image: 'https://via.placeholder.com/150',
      category: 'Running',
    },
  ];

  useEffect(() => {
    // Filter products based on selected category and search query
    let filteredProducts = [...mockProducts];
    
    if (selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter(
        (item) => item.category === selectedCategory
      );
    }
    
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setProducts(filteredProducts);
  }, [selectedCategory, searchQuery]);

  // Render each product item
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shoeshable</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for shoes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryItem,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoryContainer: {
    marginVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 1,
  },
  selectedCategory: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  productList: {
    padding: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 8,
    width: (width - 48) / 2,
    overflow: 'hidden',
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e2e2e',
  },
  addToCartButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default Shop;