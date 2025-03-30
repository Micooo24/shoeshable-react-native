import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './Redux/store';
import ProductScreen from './Screens/Product/ProductScreen';
import DisplaySingleProduct from './Screens/Product/DisplaySingleProduct';

// Create a stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // Hide the default navigation header
          }}
        >
          <Stack.Screen name="ProductScreen" component={ProductScreen} />
          <Stack.Screen name="DisplaySingleProduct" component={DisplaySingleProduct} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;