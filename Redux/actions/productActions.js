import axios from 'axios';
import { ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, GET_PRODUCTS } from '../constants';
import baseURL from '../../assets/common/baseurl';

export const getProducts = () => async (dispatch) => {
  try {
    const response = await axios.get(`${baseURL}/api/get-products`);
    dispatch({ type: GET_PRODUCTS, payload: response.data.products });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export const addProduct = (product) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);

    if (Array.isArray(product.image)) {
      product.image.forEach((img, index) => {
        console.log(`Appending image ${index}: ${img}`);
        formData.append('image', {
          uri: img,
          type: 'image/jpeg',
          name: `image${index}.jpg`,
        });
      });
    }

    console.log('FormData:', formData);

    const response = await axios.post(`${baseURL}/api/add-product`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: ADD_PRODUCT, payload: response.data.product });
  } catch (error) {
    console.error('Error adding product:', error.response ? error.response.data : error.message);
  }
};

export const updateProduct = (id, updatedProduct) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('name', updatedProduct.name);
    formData.append('description', updatedProduct.description);
    formData.append('price', updatedProduct.price);
    formData.append('stock', updatedProduct.stock);

    if (Array.isArray(updatedProduct.image)) {
      updatedProduct.image.forEach((img, index) => {
        console.log(`Appending image ${index}: ${img}`);
        formData.append('image', {
          uri: img,
          type: 'image/jpeg',
          name: `image${index}.jpg`,
        });
      });
    }

    const response = await axios.put(`${baseURL}/api/update-product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: UPDATE_PRODUCT, payload: { id, updatedProduct: response.data.product } });
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(`${baseURL}/api/remove-product/${id}`);
    dispatch({ type: DELETE_PRODUCT, payload: id });
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};