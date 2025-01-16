import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GoogleSignup from './SocialAuth/GoogleSignup';
import { handleLoginRequest } from './loginService';
import { rw, rh, rf } from '../../themes/responsive';
import ExpoBiometricAuth from '../Auth/ExpoBiometricAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  const { dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Please enter your email';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleEmailChange = (email) => {
    setEmail(email);
    if (errors.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: null })); // Clear the email error on input
    }
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
    if (errors.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: null })); // Clear the password error on input
    }
  };

  const handleLogin = async () => {
    if (!validate()) return;
  
    setIsLoading(true);
  
    const response = await handleLoginRequest(email, password, 'manual', dispatch);
  
    let newErrors = {};
  
    if (response.data.message === "Login successful.") {
      await AsyncStorage.setItem('userToken', response.data.token);
      navigation.reset({
        index: 0,
        routes: [{ name: 'CashUp' }],
      });
    } else {
      if (response.data.error === "Email not found.") {
        newErrors.email = 'Email not found. Please check your email or sign up.';
      } else if (response.data.error === "Incorrect password. Please try again.") {
        newErrors.password = 'Incorrect password. Please try again.';
      } else if (response.data.error === "This account was created with Google. Please login using Google.") {
        newErrors.email = 'This account was created with Google. Please login using Google.';
      }
  
      setIsLoading(false);
      setErrors(newErrors);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        {/* <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/authImages/login.png')}
            style={{ width: rw(55), height: rh(30), resizeMode: 'contain' }}
          />
        </View> */}

        <Text style={[styles.title, { color: theme.text }]}>Account Login</Text>

        <TextInput
          style={[
            styles.input,
            {
              borderColor: errors.email ? 'red' : theme.border,  
              color: theme.text,
            },
          ]}
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange} // Use the new handleEmailChange
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={theme.text}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={[styles.passwordContainer, { marginTop: rh(2) }]}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: errors.password ? 'red' : theme.border,  
                color: theme.text,
                flex: 1,
              },
            ]}
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange} // Use the new handlePasswordChange
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            placeholderTextColor={theme.text}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordIcon}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={rf(2.5)}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity onPress={() => navigation.navigate('ForgetEmail')} style={styles.forgotPassword}>
          <Text style={{ color: theme.accent }}>Forgot Password?</Text>
        </TouchableOpacity>

        <SaveButton title="Login" onPress={handleLogin} loading={isLoading} />

        <View style={styles.orContainer}>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
          <Text style={{ color: theme.text, marginHorizontal: 8 }}>or</Text>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
        </View>

        <ExpoBiometricAuth />
        <GoogleSignup />
        
        <View style={styles.signupContainer}>
          <Text style={{ color: theme.text }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: theme.accent }}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rw(4),
    justifyContent:"center"
  },
  imageContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: rf(4),
    fontWeight: 'bold',
    marginBottom: rh(2.5),
    textAlign: 'center',
  },
  input: {
    height: rh(7),
    fontSize: rf(2),
    borderWidth: 1,
    borderRadius: rw(1.2),
    paddingHorizontal: rw(4),
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordIcon: {
    position: 'absolute',
    right: rw(4),
    top: rh(2.5),
  },
  errorText: {
    color: 'red',
    fontSize: rf(1.5),
    marginTop: 5,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginVertical: rh(1),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(2),
  },
  line: {
    height: rh(0.1),
    width: rw(40),
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: rh(2.5),
  },
});

export default Login;
