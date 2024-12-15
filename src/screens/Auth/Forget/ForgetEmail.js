import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../themes/ThemeContext';
import SaveButton from '../../../components/SaveButton';
import apiClient from '../../../../apiClient';
import * as Animatable from 'react-native-animatable';
import { rw, rh, rf } from '../../../themes/responsive'; // Import responsive utilities

const ForgetEmail = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const { theme } = useTheme();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordRecovery = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/send-otp-email', { email });

      if (response.data.status === "success") {
        navigation.navigate('VerifiyCode', { email });
      } else if (response.data.message === "User not found") {
        setErrors({ email: 'User not found' });
      } else {
        setErrors({ email: 'Failed to recover password. Please try again later.' });
      }
    } catch (error) {
      setErrors({ email: 'Error in password recovery. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <Animatable.View
          animation="bounceIn"
          duration={1000}
          delay={10}
          className="justify-center items-center">
          <Image source={require('../../../../assets/logo.png')} style={{ width: rw(60), height: rw(60) }} />
        </Animatable.View>
        <Text style={[styles.title, { color: theme.accent }]}>Password Recovery</Text>
        <Text style={{ color: theme.subtext, fontSize: rf(2), textAlign: 'center', marginVertical: rh(2) }}>
          Enter the email address associated{'\n'}with your account.
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: errors.email ? 'red' : theme.border, color: theme.text },
          ]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={theme.subtext}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <View style={{ marginTop: rh(3) }}>
          <SaveButton title="Recover Password" onPress={handlePasswordRecovery} loading={isLoading} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: rw(4), 
    paddingTop: rh(15),
  },
  title: { 
    fontSize: rf(3), 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  input: {
    height: rh(7), 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingHorizontal: rw(3),
    fontWeight: 'bold', 
    marginBottom: 8,
  },
  errorText: { 
    color: 'red', 
    fontSize: rf(1.4), 
    marginTop: 4 
  },
});

export default ForgetEmail;
