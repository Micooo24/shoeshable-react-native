import { 
  ADD_PRODUCT, 
  UPDATE_PRODUCT, 
  DELETE_PRODUCT, 
  GET_PRODUCTS,
  SET_PRODUCTS,
  FETCH_ENUM_VALUES_REQUEST,
  FETCH_ENUM_VALUES_SUCCESS,
  FETCH_ENUM_VALUES_FAILURE,
  // Add new constants for product details
  GET_PRODUCT_DETAILS_REQUEST,
  GET_PRODUCT_DETAILS_SUCCESS,
  GET_PRODUCT_DETAILS_FAIL
} from '../constants';

const initialState = {
  products: [],
  // Enum values state
  enumValues: {
    categories: {},
    brands: {},
    sizes: [],
    colors: [],
    genders: []
  },
  enumsLoading: false,
  enumsError: null,

  currentProduct: null,
  productLoading: false,
  productError: null
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return { 
        ...state, 
        products: action.payload 
      };
      
    case SET_PRODUCTS:
        return { 
          ...state, 
          products: action.payload 
        };

    case ADD_PRODUCT:
      return { 
        ...state, 
        products: [...state.products, action.payload] 
      };
      
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload.updatedProduct : product
        ),
      };
      
    case DELETE_PRODUCT:
      return { 
        ...state, 
        products: state.products.filter(p => p.id !== action.payload) 
      };
    
    case FETCH_ENUM_VALUES_REQUEST:
      return {
        ...state,
        enumsLoading: true,
        enumsError: null
      };
      
    case FETCH_ENUM_VALUES_SUCCESS:
      return {
        ...state,
        enumValues: action.payload,
        enumsLoading: false
      };
      
    case FETCH_ENUM_VALUES_FAILURE:
      return {
        ...state,
        enumsError: action.payload,
        enumsLoading: false
      };
    
    // Add new cases for single product details
    case GET_PRODUCT_DETAILS_REQUEST:
      return { 
        ...state, 
        productLoading: true, 
        productError: null, 
        currentProduct: null 
      };
      
    case GET_PRODUCT_DETAILS_SUCCESS:
      return { 
        ...state, 
        productLoading: false, 
        currentProduct: action.payload 
      };
      
    case GET_PRODUCT_DETAILS_FAIL:
      return { 
        ...state, 
        productLoading: false, 
        productError: action.payload 
      };
      
    default:
      return state;
  }
};
