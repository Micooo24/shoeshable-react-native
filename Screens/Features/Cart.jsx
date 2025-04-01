import React from 'react';
import { Text, View, StatusBar } from 'react-native';
import BottomNavigator from '../../Navigators/BottomNavigator';
import { styles } from '../../Styles/cart';
import { COLORS } from '../../Theme/color';

const CartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      
      {/* Cart Content */}
      <View style={styles.content}>
        <Text style={styles.emptyText}>Cart is empty</Text>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Cart" />
      </View>
    </View>
  );
};

export default CartScreen;