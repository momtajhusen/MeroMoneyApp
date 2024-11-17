import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import CustomAlert from '../../components/common/CustomAlert';
import SaveButton from '../../components/SaveButton';
import { rw, rh, rf } from '../../themes/responsive';

// Create a component
const AddWallets = () => {
  const navigation = useNavigation();
  const { state } = useContext(AppContext);
  const { theme } = useTheme();

  const [walletName, setWalletName] = useState('');
  const [currencyCode, setCurrencyCode] = useState('Select Currency');
  const [currencyId, setCurrencyId] = useState(null);
  const [iconId, setIconId] = useState(null);
  const [balance, setBalance] = useState('0'); // Corrected typo

  const defaultIconImage = 'https://uxwing.com/wp-content/themes/uxwing/download/banking-finance/wallet-to-bank-icon.png';
  const selectIconImage = state.selectIconImage || defaultIconImage;

  const [isLoading, setIsLoading] = useState(false);

  // State for alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  // Animated values for shaking
  const walletNameShake = useRef(new Animated.Value(0)).current;
  const currencyCodeShake = useRef(new Animated.Value(0)).current;
  const iconIdShake = useRef(new Animated.Value(0)).current;
  const balanceShake = useRef(new Animated.Value(0)).current;

  // Shake animation function
  const shakeAnimation = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -5, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 5, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    setCurrencyCode(state.selectCurrencyCode);
    setCurrencyId(state.selectCurrencyId);
    setIconId(state.selectIconId);
  }, [state.selectCurrencyCode, state.selectIconId]);

  const handleSave = async () => {
    if (state.selectIconImage == null) {
      shakeAnimation(iconIdShake);
      return;
    }

    if (!walletName) {
      shakeAnimation(walletNameShake);
      return;
    }

    if (!currencyCode) {
      shakeAnimation(currencyCodeShake);
      return;
    }
    setIsLoading(true); // Start loading
  
    try {
      const response = await apiClient.post('/wallets', {
        icon_id: iconId,
        name: walletName,
        balance: parseFloat(balance),
        currency: currencyId,
      });

      // Handle success response
      setAlertMessage('Wallet added successfully!');
      setAlertType('success');
      setAlertVisible(true);

      // Navigate after alert is confirmed
      setTimeout(() => {
        setAlertVisible(false);
        navigation.goBack();
      }, 2000);

    } catch (error) {
      console.log('Error saving wallet:', error);

      // Handle errors accordingly
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors).flat()[0];
        setAlertMessage(firstError);
        setAlertType('error');
        setAlertVisible(true);
      } else {
        setAlertMessage('An error occurred. Please try again.');
        setAlertType('error');
        setAlertVisible(true);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      {/* Wallet Name Input */}
      <View style={[styles.row, { backgroundColor: theme.secondary }]}>
        <Animated.View style={{ transform: [{ translateX: iconIdShake }] }}>
          <TouchableRipple onPress={() => navigation.navigate('SelectItonsTabs')}>
            <Image
              source={state.selectIconImage ? { uri: state.selectIconImage } : require('../../../assets/default-icon.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableRipple>
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { transform: [{ translateX: walletNameShake }] }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Wallet Name"
            placeholderTextColor={theme.text}
            value={walletName}
            onChangeText={(value) => setWalletName(value)}
          />
        </Animated.View>
      </View>

      {/* Select Currency */}
      <Animated.View style={{ transform: [{ translateX: currencyCodeShake }] }}>
        <TouchableRipple
          onPress={() => { navigation.navigate('Currency'); }}
          rippleColor="rgba(0, 0, 0, .32)"
          style={[styles.touchableRipple, { backgroundColor: theme.secondary }]}
        >
          <View style={styles.touchableContent}>
            <MaterialIcons color={theme.text} name="currency-exchange" size={22} />
            <Text style={{ color: theme.text }}>{currencyCode}</Text>
          </View>
        </TouchableRipple>
      </Animated.View>

      {/* Save Button */}
      <SaveButton title="Save" onPress={handleSave} loading={isLoading} />

      {/* CustomAlert for success/error messages */}
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
  );
};

// Styles for responsiveness
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rw(2), // Responsive padding
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rh(2), // Responsive margin
  },
  image: {
    width: rw(10),  // Responsive width
    height: rh(5),  // Responsive height
    marginRight: rw(2), // Responsive margin
  },
  inputContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    height: rh(5),  // Responsive height
    fontSize: rf(2), // Responsive font size
    paddingHorizontal: rw(2), // Responsive padding
  },
  touchableRipple: {
    paddingVertical: rh(2), // Responsive padding
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  touchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rw(2), // Responsive padding
  },
});

export default AddWallets;
