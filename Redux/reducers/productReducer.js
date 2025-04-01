import { 
  ADD_PRODUCT, 
  UPDATE_PRODUCT, 
  DELETE_PRODUCT, 
  GET_PRODUCTS,
  FETCH_ENUM_VALUES_REQUEST,
  FETCH_ENUM_VALUES_SUCCESS,
  FETCH_ENUM_VALUES_FAILURE
} from '../constants';

// No fallback values - we'll get everything from the API

const initialState = {
  products: [],
  // Add enum values state - empty object initially
  enumValues: {
    categories: {},
    brands: {},
    sizes: [],
    colors: [],
    genders: []
  },
  enumsLoading: false,
  enumsError: null
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
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
      
    default:
      return state;
  }
};