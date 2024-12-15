// ExpoBiometricAuth.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';
import { handleLoginRequest } from './loginService';
import { rw, rh, rf } from '../../themes/responsive';

const ExpoBiometricAuth = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [isBiometricAuthAvailable, setIsBiometricAuthAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(AppContext);
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricEnrolled(enrolled);

        const biometricAuthData = await AsyncStorage.getItem('BiometricAuth');
        if (biometricAuthData) {
          const { Auth } = JSON.parse(biometricAuthData);
          setIsBiometricAuthAvailable(Auth);
        }
      }
    };

    checkBiometricSupport();
  }, []);

  const handleBiometricAuth = async () => {
    const biometricAuthData = await AsyncStorage.getItem('BiometricAuth');

    if (biometricAuthData) {
      const { email, password, method } = JSON.parse(biometricAuthData);

      setIsLoading(true);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'MeroMoney login with fingure',
        fallbackLabel: 'Use Passcode',
      });

      setIsLoading(false);

      if (result.success) {
        await handleLoginRequest(email, password, method, dispatch);
        
        navigation.reset({
          index: 0,
          routes: [{ name: 'CashUp' }],
        });
      } else {
        console.log('Authentication Failed', 'Please try again.');
      }
    } else {
      console.log('No Biometric Data Found', 'Please log in manually first.');
    }
  };

  return (
    <View style={{borderRadius: rw(2) }}>
      {isBiometricSupported && isBiometricEnrolled && isBiometricAuthAvailable ? (
        <TouchableOpacity 
          onPress={handleBiometricAuth} 
          style={{ 
            marginTop: rh(1),
            borderWidth:1,
            borderColor:theme.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: rh(1.5), // responsive padding
            paddingHorizontal: rw(4), // responsive padding
            borderRadius: rw(2.5), // responsive border-radius
            borderWidth: 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.text} />
          ) : (
            <>
              <MaterialCommunityIcons name="fingerprint" size={rf(3)} color={theme.text} />
              <Text style={{ color: theme.text, marginLeft: rw(2), fontSize: rf(2) }}>Fingure Login</Text>
            </>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ExpoBiometricAuth;
