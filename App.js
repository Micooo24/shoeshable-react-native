// import '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './Navigators/MainNavigator'; // Import MainNavigator
import AuthNavigator from './Navigators/AuthNavigator';
import BottomNavigator from './Navigators/BottomNavigator';
import store from './Redux/store';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <MainNavigator />
      {/* You can add more navigators here if needed */}
      <StatusBar style="auto" />
    </NavigationContainer>
    </Provider>
  );
}
