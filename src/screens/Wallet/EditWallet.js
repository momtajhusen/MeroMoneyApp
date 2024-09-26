import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import apiClient from '../../../apiClient'; // Import your API client
import { useTheme } from '../../themes/ThemeContext';

const EditWallet = ({ route }) => {
  const { data } = route.params;
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const [walletName, setWalletName] = useState(data.name);
  const [currencyCode, setCurrencyCode] = useState('Select Currency');
  const [iconId, setIconId] = useState(data.icon_id);
  const [balance, setBalance] = useState(data.balance ? data.balance.toString() : ''); // Ensure balance is a string
  
  const BASE_URL = 'https://finance.scriptqube.com/storage/';
  const defaultIconImage = 'https://uxwing.com/wp-content/themes/uxwing/download/banking-finance/wallet-to-bank-icon.png';
  const selectIconImage = data.icon_path ? `${BASE_URL}${data.icon_path}` : defaultIconImage;

  useEffect(() => {
    setCurrencyCode(state.selectCurrencyCode || data.currency || 'Default Currency');
    setIconId(state.selectIconId || data.icon_id);
  }, [state.selectCurrencyCode, state.selectIconId]);

  useEffect(() => {
    dispatch({ type: 'SET_CURRENCY_CODE', payload: data.currency });
    dispatch({ type: 'SET_ICON_ID', payload: data.icon_id });
  }, []);

  const handleSave = async () => {
    if (!walletName || !currencyCode || !iconId || !balance) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await apiClient.put(`/wallets/${data.id}?user_id=${state.userId}`, {
        user_id: state.userId, // Assuming user ID is available
        icon_id: iconId,
        name: walletName,
        balance: parseFloat(balance),
        currency: currencyCode,
      });

      Alert.alert('Success', 'Wallet updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Error updating wallet:', error);

      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors).flat()[0];
        Alert.alert('Validation Error', firstError);
      } else if (error.response && error.response.status === 500) {
        Alert.alert('Server Error', 'There is an issue with the server. Please try again later.');
      } else if (error.response) {
        Alert.alert('Error', `An error occurred: ${error.response.status} - ${error.response.statusText}`);
      } else {
        Alert.alert('Error', 'Network error. Please check your internet connection and try again.');
      }
    }
  };

  return (
      <View className="px-5 flex-1" style={{backgroundColor:theme.primary}}>
        <View className="p-2" style={[styles.row, {backgroundColor:theme.secondary}]}>
          <TouchableRipple onPress={() => navigation.navigate('SelectItonsTabs')}>
            <Image
              source={{ uri: selectIconImage }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableRipple>
          <TextInput
            style={[styles.input, {color:theme.text}]}
            placeholder="Wallet Name"
            value={walletName}
            onChangeText={setWalletName}
          />
        </View>

        <TouchableRipple
          onPress={() => navigation.navigate('Currency')}
          rippleColor="rgba(0, 0, 0, .32)"
          style={[styles.touchableRipple, { backgroundColor:theme.secondary,borderColor:theme.border,}]}
          className="p-3 mb-3"
        >
          <View style={[styles.touchableContent]}>
            <MaterialIcons color={theme.text} name="currency-exchange" size={22} />
            <Text style={{ marginLeft: 5, color:theme.text }}>{currencyCode}</Text>
          </View>
        </TouchableRipple>

        <View className="px-2 mb-8" style={[styles.balanceContainer, { backgroundColor:theme.secondary,borderColor:theme.border,}]}>
          <TextInput
            style={[styles.balanceInput, {color:theme.text}]}
            placeholder="Initial Balance"
            value={balance}
            onChangeText={setBalance}
            keyboardType="numeric"
          />
        </View>

        <TouchableRipple
          onPress={handleSave}
          rippleColor="rgba(0, 0, 0, .32)"
          style={styles.saveButton}
        >
          <View>
            <Text style={styles.saveButtonText}>Save</Text>
          </View>
        </TouchableRipple>
      </View>

  );
};

export default EditWallet;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
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
    marginRight: 10,
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
    borderBottomWidth: 1,
  },
  balanceInput: {
    height: 50,
    fontSize: 18,
    fontWeight: 'bold',
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
