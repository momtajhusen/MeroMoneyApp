// Import necessary libraries
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import apiClient from '../../../apiClient'; // Assuming apiClient is configured for your API
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../context/AppContext';
import SaveButton from '../../components/SaveButton';
import { useTheme } from '../../themes/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const navigation = useNavigation();

  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();
 


  // Handle login request
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setisLoading(true);

    try {
      const response = await apiClient.post('/login', {
        email,
        password
      });

      if (response.data.token) {
        // Save token to AsyncStorage (or any storage) for future authenticated requests
        await AsyncStorage.setItem('authToken', response.data.token);
        dispatch({
          type: 'SET_USER',
          payload: {
            userId: response.data.user.id,
            userRole: response.data.user.role,
            userEmail: response.data.user.email,
            userName: response.data.user.name,
          },
        });
        navigation.navigate('CashUp');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setisLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor:theme.primary}]}>
      <Text style={[styles.title, {color:theme.text}]}>Login</Text>

      {/* Email Input */}
      <TextInput
        style={[styles.input, {backgroundColor:theme.secondary, borderColor:theme.border, color:theme.text}]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={theme.text} 
      />

      {/* Password Input */}
      <TextInput
        style={[styles.input, {backgroundColor:theme.secondary, borderColor:theme.border, color:theme.text}]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor={theme.text} 
      />

      <SaveButton 
        onPress={handleLogin} 
        loading={isLoading}
      />

      <TouchableOpacity                  
          onPress={() => {navigation.navigate('Signup')}}
      >
           <Text style={{color:theme.text}}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the Login component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default Login;
