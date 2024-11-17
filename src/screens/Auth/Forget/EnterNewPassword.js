import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../themes/ThemeContext';
import SaveButton from '../../../components/SaveButton';
import apiClient from '../../../../apiClient';
import Icon from 'react-native-vector-icons/Feather'; // Importing Feather icons for the eye icon
import { rw, rh, rf } from '../../../themes/responsive';

const { width, height } = Dimensions.get('window'); // Get device dimensions

const EnterNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const navigation = useNavigation();
  const { theme } = useTheme();
  const route = useRoute();
  const { email } = route.params;

  const validate = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'Please enter your new password';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/update-password', { email, newPassword });
      console.log('API Response:', response);
      if (response.data && response.data.message === "Password updated successfully") {
        navigation.replace('PasswordChangeSucess');
      } else {
        setErrors({ general: 'Failed to update password. Please try again later.' });
      }
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);
      setErrors({ general: 'Error in updating password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    if (errors.newPassword) {
      setErrors(prevErrors => ({ ...prevErrors, newPassword: null }));
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (errors.confirmPassword) {
      setErrors(prevErrors => ({ ...prevErrors, confirmPassword: null }));
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <Animatable.View animation="bounceIn" duration={1000} delay={10} style={styles.logoContainer}>
          <Image source={require('../../../../assets/logo.png')} style={[styles.logo, { width: width * 0.25, height: width * 0.25 }]} />
        </Animatable.View>
        <Text style={[styles.title, { color: theme.accent }]}>Enter New Password</Text>
        <Text style={[styles.description, { color: theme.subtext }]}>
          Enter your new password and confirm it to reset your account access. {'\n'}Ensure your password is secure.
        </Text>

        {/* New Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: errors.newPassword ? 'red' : theme.border,
                color: theme.text,
              },
            ]}
            placeholder="New Password"
            value={newPassword}
            onChangeText={handleNewPasswordChange}
            secureTextEntry={!showNewPassword}
            autoCapitalize="none"
            placeholderTextColor={theme.text}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
            <Icon name={showNewPassword ? 'eye-off' : 'eye'} size={rf(2.5)} color={theme.text} />
          </TouchableOpacity>
        </View>
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

        {/* Confirm Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: errors.confirmPassword ? 'red' : theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            placeholderTextColor={theme.text}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={rf(2.5)} color={theme.text} />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

        <View style={{ marginTop: rh(3) }}>
          <SaveButton title="Continue" onPress={handleSave} loading={isLoading} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: rw(4), paddingTop: rh(15) },
  title: { fontSize: rf(3), fontWeight: 'bold', textAlign: 'center' },
  description: { fontSize: rf(1.8), textAlign: 'center', marginVertical: rh(2) },
  input: {
    height: rh(7), 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingHorizontal: rw(2),
    fontWeight: 'bold', 
    marginBottom: rh(2),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyeIcon: { position: 'absolute', right: rw(2) },
  errorText: { color: 'red', fontSize: rf(1.2), marginTop: rh(0.5) },
  logoContainer: { justifyContent: 'center', alignItems: 'center' },
  logo: { borderRadius: 10 },
});

export default EnterNewPassword;
