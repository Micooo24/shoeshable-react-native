import React, { useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, addProduct, deleteProduct } from '../../Redux/actions/productActions';

const ProductScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    const newProduct = { name: 'New Product', price: 99 };
    dispatch(addProduct(newProduct));
  };

  return (
    <View>
      <Button title="Add Product" onPress={handleAddProduct} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name} - ${item.price}</Text>
            <Button title="Delete" onPress={() => dispatch(deleteProduct(item.id))} />
          </View>
        )}
      />
    </View>
  );
};

export default ProductScreen;
