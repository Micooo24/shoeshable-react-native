import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../Redux/actions/productActions';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const ProductScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: [],
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleAddProduct = async () => {
    const imagesBase64 = await Promise.all(newProduct.image.map(async (uri) => {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return `data:image/jpeg;base64,${base64}`;
    }));

    const productWithBase64Images = { ...newProduct, image: imagesBase64 };
    dispatch(addProduct(productWithBase64Images));
    setModalVisible(false);
    setNewProduct({ name: '', description: '', price: '', stock: '', image: [] });
  };

  const handleUpdateProduct = async () => {
    const imagesBase64 = await Promise.all(newProduct.image.map(async (uri) => {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return `data:image/jpeg;base64,${base64}`;
    }));

    const updatedProductWithBase64Images = { ...newProduct, image: imagesBase64 };
    dispatch(updateProduct(currentProductId, updatedProductWithBase64Images));
    setModalVisible(false);
    setIsEditing(false);
    setNewProduct({ name: '', description: '', price: '', stock: '', image: [] });
  };

  const handleSelectImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewProduct({ ...newProduct, image: result.assets.map(asset => asset.uri) });
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image.map(img => img.uri),
    });
    setCurrentProductId(product._id);
    setIsEditing(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Button title="Add Product" onPress={() => {
        setNewProduct({ name: '', description: '', price: '', stock: '', image: [] });
        setIsEditing(false);
        setModalVisible(true);
      }} />
      <FlatList
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Text style={styles.productId}>ID: {item._id}</Text>
            {item.image && item.image.map((img, index) => (
              <Image key={index} source={{ uri: img.uri }} style={styles.productImage} />
            ))}
            <Button title="Edit" onPress={() => handleEditProduct(item)} />
            <Button title="Delete" onPress={() => dispatch(deleteProduct(item._id))} />
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newProduct.description}
              onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={newProduct.price}
              onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={newProduct.stock}
              onChangeText={(text) => setNewProduct({ ...newProduct, stock: text })}
              keyboardType="numeric"
            />
            <Button title="Select Images" onPress={handleSelectImages} />
            <View style={styles.imagePreviewContainer}>
              {newProduct.image && newProduct.image.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.imagePreview} />
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={isEditing ? handleUpdateProduct : handleAddProduct}>
                <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 40,
  },
  productContainer: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  productId: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  imagePreview: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductScreen;