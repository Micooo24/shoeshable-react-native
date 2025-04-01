import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk }from 'redux-thunk';
import { productReducer } from './reducers/productReducer';

const rootReducer = combineReducers({
  product: productReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;