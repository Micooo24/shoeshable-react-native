import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './Redux/store';
import Product from './Screens/Product/Product';
import SingleProduct from './Screens/Product/SingleProduct';
import Home from './Screens/Home';
import CategoryScreen from './Screens/Features/CategoryScreen';
import CartScreen from './Screens/Features/CartScreen.jsx';
import TrendsScreen from './Screens/Features/TrendsScreen';
import Profile from './Screens/Common/Profile';
import Login from './Screens/Common/Login';
import Register from './Screens/Common/Register';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Product" component={Product} />
          <Stack.Screen name="SingleProduct" component={SingleProduct} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Trends" component={TrendsScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;