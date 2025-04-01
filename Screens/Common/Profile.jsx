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

const COLORS = {
  primary: "#2c3e50", // Dark blue-gray
  primaryLight: "#34495e", 
  primaryDark: "#1a2530", // Darker blue-gray
  white: "#ffffff", // Pure white
  light: "#ecf0f1", // Light gray
  grey: "#bdc3c7", // Medium gray
  darkGrey: "#7f8c8d", // Darker gray
  text: "#2c3e50", // Text in dark blue-gray
  textLight: "#7f8c8d", // Light text in gray
  success: "#2ecc71", // Success green
  warning: "#f39c12", // Warning orange
  danger: "#e74c3c", // Danger red
  shadow: "rgba(44, 62, 80, 0.15)", // Shadow based on primary color
  accent: "#3498db", // Accent blue
};

const Profile = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const purchaseStatuses = [
    { title: "To Pay", icon: "credit-card-outline" },
    { title: "To Ship", icon: "package-variant-closed" },
    { title: "To Deliver", icon: "truck-delivery-outline" },
    { title: "To Rate", icon: "star-outline" },
  ];

  const handleLoginPress = () => {
    navigation.navigate('Login'); // Navigate to your login screen
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  welcomeText: {
    color: COLORS.light,
    fontSize: 13,
    fontWeight: "500",
  },
  username: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 6,
  },
  authContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  authText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
  },
  authButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  authButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 1,
  },
  registerButton: {
    backgroundColor: COLORS.white,
  },
  authButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  registerButtonText: {
    color: COLORS.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for the nav bar
  },
  purchasesContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 8,
  },
  viewAllText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  purchaseStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusItem: {
    alignItems: "center",
    width: "23%",
  },
  statusIconContainer: {
    backgroundColor: COLORS.light,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "500",
  },
  ordersList: {
    marginTop: 4,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  orderIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  orderSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light,
    marginVertical: 4,
  },
  wishlistPreview: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginBottom: 12,
  },
  browseButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  browseButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  emptySpace: {
    height: 40,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
});