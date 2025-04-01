import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ScrollView
} from "react-native";
import BottomNavigator from "../../Navigators/BottomNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from '../../Theme/color.js';
import { styles } from '../../Styles/profile.js';

const Profile = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const purchaseStatuses = [
    { title: "To Pay", icon: "credit-card-outline" },
    { title: "To Ship", icon: "package-variant-closed" },
    { title: "To Deliver", icon: "truck-delivery-outline" },
    { title: "To Rate", icon: "star-outline" },
  ];

  const handleLoginPress = () => {
    navigation.navigate('Login'); 
  };
  
  const handleRegisterPress = () => {
    navigation.navigate('Register'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Streamlined Header Section */}
      <View style={styles.header}>
        {isLoggedIn ? (
          <View style={styles.userInfoContainer}>
            <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
            />
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.username}>{userData.username}</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Icon name="cog-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.authContainer}>
            <Icon name="account-circle" size={40} color={COLORS.white} />
            <View style={styles.authTextContainer}>
              <Text style={styles.authText}>Please login</Text>
            </View>
            <View style={styles.authButtonsContainer}>
              <TouchableOpacity
                style={styles.authButton}
                onPress={handleLoginPress}
                activeOpacity={0.8}
              >
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authButton, styles.registerButton]}
                onPress={handleRegisterPress}
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Scrollable Content Section */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* My Purchases Section */}
          <View style={styles.purchasesContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWrapper}>
                <Icon name="shopping" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>My Purchases</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.purchaseStatusRow}>
              {purchaseStatuses.map((status, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.statusItem}
                  onPress={() => console.log(`Navigate to ${status.title}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.statusIconContainer}>
                    <Icon name={status.icon} size={24} color={COLORS.accent} />
                  </View>
                  <Text style={styles.statusText}>{status.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Orders Section */}
          <View style={styles.purchasesContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWrapper}>
                <Icon name="clock-outline" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Recent Orders</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.ordersList}>
              <TouchableOpacity style={styles.orderItem}>
                <View style={[styles.orderIconBg, {backgroundColor: `${COLORS.success}20`}]}>
                  <Icon name="package-variant" size={18} color={COLORS.success} />
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderTitle}>Order #2458</Text>
                  <Text style={styles.orderSubtitle}>Delivered • April 1, 2025</Text>
                </View>
                <Text style={styles.orderPrice}>$124.99</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.orderItem}>
                <View style={[styles.orderIconBg, {backgroundColor: `${COLORS.warning}20`}]}>
                  <Icon name="truck-delivery-outline" size={18} color={COLORS.warning} />
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderTitle}>Order #2457</Text>
                  <Text style={styles.orderSubtitle}>Shipping • March 30, 2025</Text>
                </View>
                <Text style={styles.orderPrice}>$89.50</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Wishlist Preview Section */}
          <View style={styles.purchasesContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWrapper}>
                <Icon name="heart-outline" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>My Wishlist</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.wishlistPreview}>
              <Text style={styles.emptyStateText}>
                Save items you love to your wishlist
              </Text>
              <TouchableOpacity style={styles.browseButton}>
                <Text style={styles.browseButtonText}>Browse Products</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional space at bottom */}
          <View style={styles.emptySpace} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Profile" />
      </View>
    </SafeAreaView>
  );
};

export default Profile;