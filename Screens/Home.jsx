import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="shoe-formal" size={100} color="#001F3F" />
        <Text style={styles.title}>SHOESHABLE</Text>
        <Text style={styles.subtitle}>sapatos</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
        >
          <Text style={[styles.buttonText, styles.registerButtonText]}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#001F3F',
    marginTop: 24,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    letterSpacing: 2,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#001F3F',
  },
  registerButton: {
    backgroundColor: '#FFD700',
    borderWidth: 1,
    borderColor: '#001F3F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
  },
  registerButtonText: {
    color: '#001F3F',
  },
});

export default Home;