import { rw, rh, rf } from '../../../themes/responsive';
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../themes/ThemeContext';
import SaveButton from '../../../components/SaveButton';
import apiClient from '../../../../apiClient';
import Icon from 'react-native-vector-icons/Feather';
import { AppContext } from '../../../context/AppContext';
import CustomAlert from '../../../components/common/CustomAlert';

const OldPasswordChange = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const { state } = useContext(AppContext);
  const email = state.userEmail;

  const validate = () => {
    const newErrors = {};
    
    if (!oldPassword) {
      newErrors.oldPassword = 'Please enter your old password';
    }
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
    if(oldPassword != ''){
      if (oldPassword === newPassword) {
        setErrors({ newPassword: 'New password cannot be the same as old password' });
        return;
      }
    }

    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/change-password', { email, oldPassword, newPassword });
      if (response.data && response.data.message === "Password updated successfully") {
        setAlertMessage('Password changed successfully.');
        setAlertType('success');
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
          navigation.goBack();
        }, 2000);
      } else {
        setErrors({ general: 'Failed to update password. Please try again later.' });
      }
    } catch (error) {
      if (error.response?.data.message === 'Old password is incorrect') {
        setErrors({ oldPassword: 'Old password is incorrect' });
      } else {
        setErrors({ general: error.response?.data.message || 'Error in updating password. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../../../../assets/logo.png')} style={{ width: rw(25), height: rw(25) }} />
        </View>
        <Text style={[styles.title, { color: theme.accent }]}>Change Password</Text>
        <Text style={{ color: theme.subtext, fontSize: rf(2), textAlign: 'center', marginVertical: rh(2) }}>
          Enter your current password and set a new one to reset your account access. Ensure your password is secure.
        </Text>

        {/* Old Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: errors.oldPassword ? 'red' : theme.border, color: theme.text, flex: 1 },
            ]}
            placeholder="Old Password"
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
            secureTextEntry={!showOldPassword}
            autoCapitalize="none"
            placeholderTextColor={theme.text}
          />
          <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={{ position: 'absolute', right: rw(3), top: rh(3) }}>
            <Icon name={showOldPassword ? 'eye-off' : 'eye'} size={rf(3)} color={theme.text} />
          </TouchableOpacity>
        </View>
        {errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword}</Text>}

        {/* New Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: errors.newPassword ? 'red' : theme.border, color: theme.text, flex: 1 },
            ]}
            placeholder="New Password"
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry={!showNewPassword}
            autoCapitalize="none"
            placeholderTextColor={theme.text}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: rw(3), top: rh(3) }}>
            <Icon name={showNewPassword ? 'eye-off' : 'eye'} size={rf(3)} color={theme.text} />
          </TouchableOpacity>
        </View>
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

        {/* Confirm Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: errors.confirmPassword ? 'red' : theme.border, color: theme.text, flex: 1 },
            ]}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            placeholderTextColor={theme.text}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: rw(3), top: rh(3) }}>
            <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={rf(3)} color={theme.text} />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

        <View style={{ marginTop: rh(3) }}>
          <SaveButton title="Continue" onPress={handleSave} loading={isLoading} />
        </View>

        <CustomAlert
          visible={alertVisible}
          title={alertType === 'success' ? 'Success' : 'Error'}
          message={alertMessage}
          confirmText="OK"
          onOk={() => setAlertVisible(false)}
          theme={theme}
          type={alertType}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: rw(4), paddingTop: rh(10) },
  title: { fontSize: rf(3), fontWeight: 'bold', textAlign: 'center' },
  input: {marginTop:rh(1), height: rh(7), borderWidth: 1, borderRadius: 5, paddingHorizontal: rw(3), fontWeight: 'bold' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  errorText: { color: 'red', fontSize: rf(1.5), marginTop:rh(0.3)},
});

export default OldPasswordChange;