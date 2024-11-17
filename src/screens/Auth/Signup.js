import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';
import { handleSignupRequest } from './signupService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GoogleSignup from './SocialAuth/GoogleSignup';
import { rw, rh, rf } from '../../themes/responsive';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { theme } = useTheme();

  const validateInputs = () => {
    let valid = true;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
      valid = false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email';
      valid = false;
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const response = await handleSignupRequest(name, email, password, (method = 'manual'));
      console.log(response.data);

      if (response.data.message === "Account created successfully") {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Login');
      } else if (response.status === 409 && response.data.status === "user_exists") {
        const loginMethod = response.data.method;
        const loginMessage = loginMethod === 'manual'
          ? "Use email and password to log in."
          : loginMethod === 'google'
          ? "Log in with Google."
          : loginMethod === 'facebook'
          ? "Log in with Facebook."
          : "Use the original login method.";

        setErrors((prev) => ({
          ...prev,
          email: `Email is already in use. ${loginMessage}`,
        }));
      }      
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <View style={{ marginBottom: rh(2) }}>
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={{ marginTop: rh(1), color: theme.text, fontSize: rf(2) }}>Become New user</Text>
        </View>

        <TextInput
          style={[
            styles.input,
            { borderColor: errors.name ? 'red' : theme.border, color: theme.text },
          ]}
          placeholder="Name"
          placeholderTextColor={theme.text}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: '' }));
          }}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={[
            styles.input,
            { borderColor: errors.email ? 'red' : theme.border, color: theme.text },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.text}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: errors.password ? 'red' : theme.border, color: theme.text, flex: 1 },
            ]}
            placeholder="Password"
            placeholderTextColor={theme.text}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: rw(2), top: rh(2) }}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={rf(3)}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TextInput
          style={[
            styles.input,
            { borderColor: errors.confirmPassword ? 'red' : theme.border, color: theme.text },
          ]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.text}
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors((prev) => ({ ...prev, confirmPassword: '' }));
          }}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <SaveButton title="Sign up" onPress={handleSignup} loading={isLoading} />

        {/* Or Line */}
        <View style={styles.orContainer}>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
          <Text style={{ color: theme.text, marginHorizontal: rw(2) }}>or</Text>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
        </View>

        <GoogleSignup />

        <View className="items-center mt-5">
          <View className="flex-row">
            <Text style={{ color: theme.text }}>By sign up you agree the </Text>
            <TouchableOpacity onPress={() => navigation.navigate('TermsAndConditionsScreen')}>
              <Text style={{ color: theme.accent }}>Terms of service</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row mt-3">
            <Text style={{ color: theme.text }}>Have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: theme.accent }}>Login now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rw(4),
    paddingTop: rh(5),
  },
  title: {
    fontSize: rf(4),
    fontWeight: 'bold',
    textAlign: 'start',
  },
  input: {
    height: rh(7),
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: rh(2),
    paddingHorizontal: rw(2),
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rh(1),
  },
  errorText: {
    color: 'red',
    fontSize: rf(1.5),
    marginBottom: rh(2),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(3),
  },
  line: {
    height: 1,
    width: '42%',
  },
});

export default Signup;
