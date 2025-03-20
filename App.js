import React from 'react';
import { Provider } from 'react-redux';
import store from './Redux/store';
import ProductScreen from './Screens/Product/ProductScreen';

const App = () => {
  return (
    <Provider store={store}>
      <ProductScreen />
    </Provider>
  );
};

export default App;
