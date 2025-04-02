import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Fix the import for redux-thunk
import { productReducer } from './reducers/productReducer';
import { cartReducer } from './reducers/cartReducers'; // Import your cartReducer

// Combine reducers (useful when scaling the app)
const rootReducer = combineReducers({ 
  product: productReducer,
  cart: cartReducer, 
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;