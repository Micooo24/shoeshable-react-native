import axios from 'axios';
import { ADD_PRODUCT, 
  UPDATE_PRODUCT, 
  DELETE_PRODUCT,
  GET_PRODUCTS,
  FETCH_ENUM_VALUES_FAILURE,
  FETCH_ENUM_VALUES_REQUEST,
  FETCH_ENUM_VALUES_SUCCESS } from '../constants';
import baseURL from '../../assets/common/baseurl';

const MAX_PRICE = 1000000;

export const fetchEnumValues = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ENUM_VALUES_REQUEST });
    
    const response = await axios.get(`${baseURL}/api/products/enums`);
    
    dispatch({ 
      type: FETCH_ENUM_VALUES_SUCCESS, 
      payload: response.data.data 
    });
    
    return response.data.data;
  } catch (error) {
    dispatch({ 
      type: FETCH_ENUM_VALUES_FAILURE, 
      payload: error.response && error.response.data.error 
        ? error.response.data.error 
        : error.message 
    });
    throw error;
  }
};

export const getProducts = () => async (dispatch) => {
  try {
    const response = await axios.get(`${baseURL}/api/products/get-products`);
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
    
    // Add shoe-specific fields
    formData.append('category', product.category);
    formData.append('brand', product.brand);
    
    // Handle arrays - size and color
    if (Array.isArray(product.size)) {
      product.size.forEach(size => {
        formData.append('size', size);
      });
    } else if (product.size) {
      formData.append('size', product.size);
    }

    if (Array.isArray(product.color)) {
      product.color.forEach(color => {
        formData.append('color', color);
      });
    } else if (product.color) {
      formData.append('color', product.color);
    }
    
    // Add gender
    formData.append('gender', product.gender);
    
    // Add optional fields if they exist
    if (product.material) {
      formData.append('material', product.material);
    }

    // Handle images
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

    const response = await axios.post(`${baseURL}/api/products/add-product`, formData, {
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

    // Add shoe-specific fields
    if (updatedProduct.category) {
      formData.append('category', updatedProduct.category);
    }
    
    if (updatedProduct.brand) {
      formData.append('brand', updatedProduct.brand);
    }
    
    // Handle arrays - size and color
    if (Array.isArray(updatedProduct.size)) {
      updatedProduct.size.forEach(size => {
        formData.append('size', size);
      });
    } else if (updatedProduct.size) {
      formData.append('size', updatedProduct.size);
    }

    if (Array.isArray(updatedProduct.color)) {
      updatedProduct.color.forEach(color => {
        formData.append('color', color);
      });
    } else if (updatedProduct.color) {
      formData.append('color', updatedProduct.color);
    }
    
    // Add gender
    if (updatedProduct.gender) {
      formData.append('gender', updatedProduct.gender);
    }
    
    // Add optional fields if they exist
    if (updatedProduct.material !== undefined) {
      formData.append('material', updatedProduct.material);
    }

    // Handle images
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

    const response = await axios.put(`${baseURL}/api/products/update-product/${id}`, formData, {
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
    await axios.delete(`${baseURL}/api/products/remove-product/${id}`);
    dispatch({ type: DELETE_PRODUCT, payload: id });
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

export const searchProducts = (filters) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all filter parameters to the query
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${baseURL}/api/products/search?${queryParams.toString()}`);
    dispatch({ type: GET_PRODUCTS, payload: response.data.products });
  } catch (error) {
    console.error('Error searching products:', error);
  }
};

export const filterProducts = (filters) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      // Create query params from filters
      const queryParams = new URLSearchParams();
      
      if (filters.category) {
        queryParams.append('category', filters.category.toLowerCase());
      }
      
      if (filters.brand) {
        queryParams.append('brand', filters.brand.toLowerCase());
      }
      
      if (filters.gender) {
        queryParams.append('gender', filters.gender.toLowerCase());
      }
      
      if (filters.minPrice && filters.minPrice > 0) {
        queryParams.append('minPrice', filters.minPrice);
      }
      
      if (filters.maxPrice && filters.maxPrice < MAX_PRICE) {
        queryParams.append('maxPrice', filters.maxPrice);
      }
      
      if (filters.color) {
        queryParams.append('color', filters.color.toLowerCase());
      }
      
      if (filters.sort) {
        queryParams.append('sort', filters.sort);
      }
      
      console.log(`Filter query: ${baseURL}/api/products/filter?${queryParams.toString()}`);
      
      const response = await axios.get(`${baseURL}/api/products/filter?${queryParams.toString()}`);
      
      console.log('Filter response:', response.data);
      
      dispatch({
        type: SET_PRODUCTS,
        payload: response.data.products || response.data
      });
      
      dispatch({ type: SET_LOADING, payload: false });
      
      return response.data.products || response.data;
    } catch (error) {
      console.error('Error filtering products:', error);
      dispatch({
        type: SET_ERROR,
        payload: error.response?.data?.message || 'An error occurred while filtering products'
      });
      throw error;
    }
  };
};