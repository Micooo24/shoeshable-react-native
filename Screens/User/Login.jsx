import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging'; // Add this import
import { saveToken } from '../../sqlite_db/Auth';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import { COLORS } from '../../Theme/color';

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '80143970667-pujqfk20vgm63kg1ealg4ao347i1iked.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    
    // Get FCM token on component mount
    getFCMToken();
  }, []);
  
  // Function to request notification permissions and get FCM token
  const getFCMToken = async () => {
    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        
        // Get FCM token
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        setFcmToken(token);
        return token;
      }
      
      console.log('User notification permission denied');
      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      console.log('Starting Google Sign-In process...');
  
      // 1. Check for Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
  
      // 2. Perform Google Sign-In
      const signInResult = await GoogleSignin.signIn();
      console.log('Google Sign-In result:', JSON.stringify(signInResult, null, 2));
  
      // Access the user object from signInResult.data
      const user = signInResult?.user || signInResult?.data?.user;
      if (!user) {
        throw new Error('Google Sign-In did not return user information');
      }
  
      // Extract the email from the user object
      const email = user.email;
      console.log('Google user email:', email);
  
      // 3. Get tokens
      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) {
        throw new Error('No ID token found');
      }
  
      // 4. Authenticate with Firebase to get the firebaseUid
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const firebaseUser = await auth().signInWithCredential(googleCredential);
      const firebaseUid = firebaseUser.user.uid; // Get the Firebase UID
  
      console.log('Firebase UID:', firebaseUid);
      
      // Get FCM token if not already available
      const currentFcmToken = fcmToken || await getFCMToken();
  
      // 5. Send ID token, firebaseUid and FCM token to the backend
      const response = await axios.post(`${baseURL}/api/auth/google-login`, {
        idToken, // Send the ID token to the backend
        firebaseUid, // Pass the Firebase UID to the backend
        fcmToken: currentFcmToken // Add the FCM token
      });
  
      // 6. Handle backend response
      const { token, user: userData } = response.data;
      console.log('Backend response:', response.data);
      console.log('User role:', userData?.role);
  
      // Save the token locally
      await saveToken(token, email);
  
      setLoading(false);
      
      // Check if the user is an admin and navigate accordingly
      if (userData && userData.role === 'admin') {
        console.log('Admin user detected, navigating to AdminNavigator');
        navigation.navigate('AdminNavigator', { screen: 'Dashboard' });
      } else {
        console.log('Regular user detected, navigating to Home');
        navigation.navigate('Home');
      }
    } catch (error) {
      setLoading(false);
      console.error('Google Sign-In Error:', error);
  
      let errorMessage = 'Sign-in failed';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign-in cancelled';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign-in already in progress';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available';
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      Alert.alert('Error', errorMessage);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      // Get FCM token if not already available
      const currentFcmToken = fcmToken || await getFCMToken();
      
      // Make a POST request to the backend login endpoint with FCM token
      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
        fcmToken: currentFcmToken // Include FCM token in login request
      });

      // Extract the token and user data from the response
      const { token, user } = response.data;
      console.log('Login response:', response.data);
      console.log('User role:', user?.role);

      // Save the token and email locally
      await saveToken(token, formData.email);

      setLoading(false);
      
      // Check if the user is an admin and navigate accordingly
      if (user && user.role === 'admin') {
        console.log('Admin user detected, navigating to AdminNavigator');
        navigation.navigate('AdminNavigator', { screen: 'Dashboard' });
      } else {
        console.log('Regular user detected, navigating to Home');
        navigation.navigate('Home');
      }
    } catch (error) {
      setLoading(false);
      console.error('Login Error:', error);

      let errorMessage = 'Login failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Login Error', errorMessage);
    }
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.light} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Icon name="email-outline" size={20} color={COLORS.darkGrey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                value={formData.email}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock-outline" size={20} color={COLORS.darkGrey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textLight}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                value={formData.password}
              />
              <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
                <Icon 
                  name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={COLORS.darkGrey} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>SIGN IN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Icon name="google" size={20} color={COLORS.white} />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  inputIcon: {
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeIcon: {
    paddingRight: 15,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grey,
  },
  dividerText: {
    color: COLORS.textLight,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  signupLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;