import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { saveToken, saveUserData } from '../../utils/authentication';

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Configure Google Sign-In with both web and Android client IDs
    GoogleSignin.configure({
      webClientId: '80143970667-pujqfk20vgm63kg1ealg4ao347i1iked.apps.googleusercontent.com', // Your web client ID
      // androidClientId: '80143970667-piioo0cvhqtf34mpb8mk7eap1k06l9ih.apps.googleusercontent.com', // Replace with your Android client ID
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    console.log('Google Sign-In configured');
  }, []);

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google Sign-In process...');
      setLoading(true);

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('Google Play Services are available.');

      // Get the user's ID token
      const { idToken } = await GoogleSignin.signIn()
        .then(userInfo => GoogleSignin.getTokens())
        .catch(error => {
          console.log('Google Sign-In error:', error);
          throw error;
        });

      console.log('Google Sign-In successful. ID Token:', idToken);

      if (!idToken) {
        throw new Error('No ID token found. Please try again.');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('Google Credential created');

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('Firebase Sign-In successful:', userCredential.user);

      // Save user data
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      await saveToken(token);
      await saveUserData({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      setLoading(false);
      navigation.navigate('Shop');
      
    } catch (error) {
      setLoading(false);
      console.error('Google Login Error:', error);

      let errorMessage = 'Google login failed. Please try again.';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Google sign-in was cancelled.';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Google sign-in is already in progress.';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services are not available.';
      }

      Alert.alert('Google Login Error', errorMessage);
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