
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { saveToken, saveUserData } from '../../utils/authentication';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '80143970667-pujqfk20vgm63kg1ealg4ao347i1iked.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);
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
        console.log('Google Sign-In result:', signInResult);

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

        // 5. Send ID token and firebaseUid to the backend
        const response = await axios.post(`${baseURL}/api/auth/google-login`, {
            idToken, // Send the ID token to the backend
            firebaseUid, // Pass the Firebase UID to the backend
        });

        // 6. Handle backend response
        const { token, userId, email, username, firstName, lastName, phoneNumber, address, zipCode, profileImage } = response.data;
        console.log('Backend response:', response.data);

        // Save the token and user data locally
        await saveToken(token);
        await saveUserData({
            userId,
            email,
            username,
            firstName,
            lastName,
            phoneNumber,
            address,
            zipCode,
            profileImage,
            firebaseUid, // Save the Firebase UID locally
        });

        setLoading(false);
        navigation.navigate('Shop'); // Navigate to the next screen
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
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      // Sign in with email and password
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
      // User successfully logged in
      const user = userCredential.user;
      console.log('User logged in:', user.email);
      
      setLoading(false);
      navigation.navigate('Home'); // Navigate to your main screen
      
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your connection';
          break;
      }
      
      Alert.alert('Login Error', errorMessage);
    }
  };

  
  const handleSubmit = async () => {
    setLoading(true);
    const { email, password } = formData;

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      await saveToken(token);
      await saveUserData({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });

      setLoading(false);
      navigation.navigate('Shop');
    } catch (error) {
      setLoading(false);
      console.error('Firebase Login Error:', error);

      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }

      Alert.alert('Login Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#001F3F" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Email and Password Inputs remain the same */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={(text) => setFormData({...formData, email: text})}
            value={formData.email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text) => setFormData({...formData, password: text})}
            value={formData.password}
          />
        </View>

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          <Icon name="google" size={24} color="#FFFFFF" />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Your existing styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#001F3F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#001F3F',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#001F3F',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#001F3F',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DB4437',
    padding: 15,
    borderRadius: 8,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default Login;