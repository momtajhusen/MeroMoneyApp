import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import apiClient from '../../../apiClient'; // Import your API client
import { lightTheme, darkTheme } from '../../themes'; 


// Create a component
const AddWallets = () => {
  const navigation = useNavigation();
  const { state } = useContext(AppContext);

  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme;

  console.log(themeColor);


  const [walletName, setWalletName] = useState('');
  const [currencyCode, setCurrencyCode] = useState('Select Currency');
  const [iconId, setIconId] = useState(null);
  const [balance, setBalance] = useState(''); // Corrected typo

  const defaultIconImage = 'https://uxwing.com/wp-content/themes/uxwing/download/banking-finance/wallet-to-bank-icon.png';
  const selectIconImage = state.selectIconImage || defaultIconImage;

  useEffect(() => {
    setCurrencyCode(state.selectCurrencyCode);
    setIconId(state.selectIconId);
  }, [state.selectCurrencyCode, state.selectIconId]);

  const handleSave = async () => {
    if (!walletName || !currencyCode || !iconId || !balance) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    try {
      const response = await apiClient.post('/wallets', {
        user_id: state.userId, // Assuming user ID is available
        icon_id: iconId,
        name: walletName,
        balance: parseFloat(balance),
        currency: currencyCode,
      });
  
      // Handle success response
      Alert.alert('Success', 'Wallet added successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Error saving wallet:', error);
  
      // If the error is a validation error (422)
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        
        // Display the first validation error found
        const firstError = Object.values(validationErrors).flat()[0];
        Alert.alert('Validation Error', firstError);
      }
      // Handle server errors (500)
      else if (error.response && error.response.status === 500) {
        Alert.alert('Server Error', 'There is an issue with the server. Please try again later.');
      }
      // Handle other errors (e.g., network issues)
      else if (error.response) {
        Alert.alert('Error', `An error occurred: ${error.response.status} - ${error.response.statusText}`);
      }
      // Handle errors without a response (e.g., network error)
      else {
        Alert.alert('Error', 'Network error. Please check your internet connection and try again.');
      }
    }
  };
  
  return (
    <View style={{ padding: 10 }}>
      <View style={styles.card}>

        {/* Wallet Name Input */}
        <View style={styles.row}>
          <TouchableRipple onPress={() => navigation.navigate('SelectItonsTabs')}>
            <Image 
              source={{ uri: selectIconImage }}
              style={styles.image} 
              resizeMode="contain"
            />
          </TouchableRipple>
          <TextInput
            style={[styles.input, {backgroundColor:themeColor.secondary, color:themeColor.text}]}
            placeholder="Wallet Name"
            placeholderTextColor={themeColor.text} 
            value={walletName}
            onChangeText={(value) => setWalletName(value)}
          />
        </View>

        {/* Select Currency */}
        <TouchableRipple 
          onPress={() => {navigation.navigate('Currency')}} 
          rippleColor="rgba(0, 0, 0, .32)" 
          style={styles.touchableRipple}
        >
          <View style={styles.touchableContent}>
            <MaterialIcons 
              color="black" 
              name="currency-exchange" 
              size={22} 
            />
            <Text className="ml-5" style={{color:themeColor.text}}>{currencyCode}</Text>
          </View>
        </TouchableRipple>

        {/* Initial Balance Input */}
        <View style={styles.balanceContainer}>
          <TextInput
            style={styles.balanceInput}
            placeholder="Initial Balance"
            value={balance}
            onChangeText={(value) => setBalance(value)}
            keyboardType="numeric"
          />
        </View>

        <TouchableRipple
          onPress={handleSave} // Updated to use handleSave function
          rippleColor="rgba(0, 0, 0, .32)"
          style={styles.saveButton}
        >
          <View>
            <Text style={styles.saveButtonText}>Save</Text>
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
};

// Make this component available to the app
export default AddWallets;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10, // Adds space between the image and text
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  touchableRipple: {
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  touchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceContainer: {
    marginVertical: 10,
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  balanceInput: {
    height: 50,
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    textAlign: 'center',
    fontSize: 18,
  },
});
