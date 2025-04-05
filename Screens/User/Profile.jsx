import React, { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  StatusBar, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from "react-native";
import BottomNavigator from "../../Navigators/BottomNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getToken, removeToken } from "../../sqlite_db/Auth";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { styles, COLORS } from "../../Styles/profile";

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const Profile = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ username: '', avatar: 'https://via.placeholder.com/150' });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    zipCode: ''
  });

 

  const [newProfileImage, setNewProfileImage] = useState(null); // Will store base64 string

  const purchaseStatuses = [
    { title: "To Pay", icon: "credit-card-outline" },
    { title: "To Ship", icon: "package-variant-closed" },
    { title: "To Deliver", icon: "truck-delivery-outline" },
    { title: "To Rate", icon: "star-outline" },
  ];

   // Function to convert image URI to base64
   const uriToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };


// Inside fetchUserProfile function, make sure to log the image URL for debugging
const fetchUserProfile = async (token) => {
  try {
    setIsLoading(true);
    
    const response = await axios.get(`${baseURL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      const user = response.data.user;
      
      // Log the profile image URL for debugging
      console.log('Profile Image URL:', user.profileImage?.url);
      
      // Update user data state with response
      setUserData({
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        zipCode: user.zipCode,
        avatar: user.profileImage?.url || 'https://via.placeholder.com/150'
      });
      
      // Also initialize the form data for editing
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber?.toString() || '',
        address: user.address || '',
        zipCode: user.zipCode?.toString() || ''
      });
      
      // Reset new profile image when fetching fresh data
      setNewProfileImage(null);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    Alert.alert('Error', 'Failed to load profile data');
  } finally {
    setIsLoading(false);
  }
};
  // Pick an image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled) {
        const base64Image = await uriToBase64(result.assets[0].uri);
        setNewProfileImage(base64Image);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  
// Function to update user profile with new image
const updateProfile = async () => {
  try {
    setIsLoading(true);
    
    const tokenData = await getToken();
    if (!tokenData || !tokenData.authToken) {
      Alert.alert('Error', 'You need to be logged in to update your profile');
      return;
    }
    
    // Convert phone number and zip code to numbers if they're numeric strings
    const formattedData = {
      ...profileForm,
      phoneNumber: parseInt(profileForm.phoneNumber, 10),
      zipCode: parseInt(profileForm.zipCode, 10)
    };
    
    // If there's a new profile image, add it to the request body
    if (newProfileImage) {
      formattedData.profileImage = newProfileImage;
    }
    
    const response = await axios.put(
      `${baseURL}/api/auth/profile/update`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.success) {
      Alert.alert('Success', 'Profile updated successfully');
      // Refresh profile data
      fetchUserProfile(tokenData.authToken);
      setIsModalVisible(false);
    } else {
      Alert.alert('Error', response.data?.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
  } finally {
    setIsLoading(false);
  }
};

  // Check login status and fetch profile when component mounts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const tokenData = await getToken();
        if (tokenData && tokenData.authToken) {
          setIsLoggedIn(true);
          // Fetch user profile data
          fetchUserProfile(tokenData.authToken);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLoginPress = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };
  
  const handleRegisterPress = () => {
    navigation.navigate('Auth', { screen: 'Register' });
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      setIsLoggedIn(false);
      Alert.alert('Success', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  // Handle opening the profile edit modal
  const handleEditProfile = () => {
    setNewProfileImage(null);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header Section */}
      <View style={styles.header}>
        {isLoggedIn ? (
          <View style={styles.userInfoContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
              onError={(e) => {
                console.log('Error loading avatar:', e.nativeEvent.error);
                // If image fails to load, set to default
                setUserData(prev => ({...prev, avatar: 'https://via.placeholder.com/150'}));
              }}
            />
            )}
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.username}>
                {userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.username}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={handleEditProfile}
              >
                <Icon name="account-edit" size={20} color={COLORS.white} />
                <Text style={styles.editProfileText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.logoutButton, {marginLeft: 8}]}
                onPress={handleLogout}
              >
                <Icon name="logout" size={20} color={COLORS.white} />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
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
          {isLoggedIn && (
            <View style={styles.purchasesContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleWrapper}>
                  <Icon name="account-details" size={20} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>Profile Information</Text>
                </View>
              </View>
              
              <View style={{marginTop: 8}}>
                <View style={styles.profileInfoRow}>
                  <Icon name="account" size={18} color={COLORS.primary} style={{marginRight: 8}} />
                  <Text style={styles.profileLabel}>Name:</Text>
                  <Text style={styles.profileValue}>
                    {userData.firstName} {userData.lastName}
                  </Text>
                </View>
                
                <View style={styles.profileInfoRow}>
                  <Icon name="email" size={18} color={COLORS.primary} style={{marginRight: 8}} />
                  <Text style={styles.profileLabel}>Email:</Text>
                  <Text style={styles.profileValue}>{userData.email}</Text>
                </View>
                
                <View style={styles.profileInfoRow}>
                  <Icon name="phone" size={18} color={COLORS.primary} style={{marginRight: 8}} />
                  <Text style={styles.profileLabel}>Phone:</Text>
                  <Text style={styles.profileValue}>{userData.phoneNumber}</Text>
                </View>
                
                <View style={styles.profileInfoRow}>
                  <Icon name="map-marker" size={18} color={COLORS.primary} style={{marginRight: 8}} />
                  <Text style={styles.profileLabel}>Address:</Text>
                  <Text style={styles.profileValue}>{userData.address}</Text>
                </View>
                
                <View style={styles.profileInfoRow}>
                  <Icon name="zip-box" size={18} color={COLORS.primary} style={{marginRight: 8}} />
                  <Text style={styles.profileLabel}>Zip Code:</Text>
                  <Text style={styles.profileValue}>{userData.zipCode}</Text>
                </View>
              </View>
            </View>
          )}
          
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

       {/* Profile Edit Modal - Modified to remove camera option */}
       <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{marginVertical: 20}} />
            ) : (
              <>
                {/* Profile Image Section - Modified */}
                <View style={styles.profileImageContainer}>
                <Image
                      source={{ 
                        uri: newProfileImage || userData.avatar 
                      }}
                      style={styles.profileImagePreview}
                      onError={(e) => {
                        console.log('Error loading profile image preview:', e.nativeEvent.error);
                      }}
                    />
                  <TouchableOpacity
                    style={[styles.imageButton, {width: '80%', marginTop: 10}]}
                    onPress={pickImage}
                  >
                    <Icon name="image" size={16} color={COLORS.white} />
                    <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={profileForm.firstName}
                    onChangeText={(text) => setProfileForm({...profileForm, firstName: text})}
                    placeholder="First Name"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={profileForm.lastName}
                    onChangeText={(text) => setProfileForm({...profileForm, lastName: text})}
                    placeholder="Last Name"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={profileForm.phoneNumber}
                    onChangeText={(text) => setProfileForm({...profileForm, phoneNumber: text})}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    style={styles.input}
                    value={profileForm.address}
                    onChangeText={(text) => setProfileForm({...profileForm, address: text})}
                    placeholder="Address"
                  />
                  </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Zip Code</Text>
                  <TextInput
                    style={styles.input}
                    value={profileForm.zipCode}
                    onChangeText={(text) => setProfileForm({...profileForm, zipCode: text})}
                    placeholder="Zip Code"
                    keyboardType="number-pad"
                  />
                </View>
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={updateProfile}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigator navigation={navigation} activeScreen="Profile" />
      </View>
    </SafeAreaView>
  );
};

export default Profile;