// import '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './Navigators/MainNavigator'; // Import MainNavigator
import store from './Redux/store';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <MainNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
    </Provider>
  );
}
