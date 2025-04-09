import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../Theme/color';
import { getToken, removeToken } from "../../sqlite_db/Auth";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

const DrawerContent = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ 
    username: 'John Doe', 
    role: 'Administrator',
    avatar: 'https://i.pravatar.cc/150?img=12' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    zipCode: ''
  });

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

  // Fetch user profile data
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
          username: user.username || 'John Doe',
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          address: user.address,
          zipCode: user.zipCode,
          role: user.role || 'User',
          avatar: user.profileImage?.url || 'https://i.pravatar.cc/150?img=12'
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

  // Check login status on component mount
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

  const handleLogout = async () => {
    try {
      await removeToken();
      setIsLoggedIn(false);
      Alert.alert('Success', 'You have been logged out successfully.');
      props.navigation.navigate("Home");
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Drawer Header with Profile */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={styles.headerContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={isLoggedIn ? pickImage : null}>
            <Image
              source={{ uri: userData.avatar }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.username}</Text>
            <Text style={styles.profileRole}>{userData.role}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={() => props.navigation.closeDrawer()}>
          <Ionicons name="close" size={24} color={COLORS.light} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Drawer Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        showsVerticalScrollIndicator={false}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  headerContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  profileRole: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 3,
  },
  closeButton: {
    padding: 8,
  },
  drawerContent: {
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 12,
    marginHorizontal: 20,
  },
  extraItemsSection: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  sectionTitle: {
    color: COLORS.grey,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  drawerItemIcon: {
    width: 26,
    alignItems: 'center',
  },
  drawerItemText: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.accent1,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  logoutText: {
    marginLeft: 10,
    color: COLORS.danger,
    fontWeight: '600',
    fontSize: 15,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.grey,
  },
});

export default DrawerContent;