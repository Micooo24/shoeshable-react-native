import { ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, GET_PRODUCTS } from '../constants';

const initialState = {
  products: [],
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return { ...state, products: action.payload };
    case ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload.updatedProduct : product
        ),
      };
    case DELETE_PRODUCT:
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    default:
      return state;
  }
};