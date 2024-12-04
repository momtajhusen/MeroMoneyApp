import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import apiClient from '../../../apiClient'; // Import your API client
import { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';

const EditWallet = ({ route }) => {
  const { data } = route.params;
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [walletName, setWalletName] = useState(data.name);
  const [currencyCode, setCurrencyCode] = useState(data.currency_code);
  const [iconId, setIconId] = useState(data.icon_id);
  const [selectIconImage, setSelectIconImage] = useState(data.icon_path);
  const [balance, setBalance] = useState(data.balance ? data.balance.toString() : '');

  const BASE_URL = 'https://finance.scriptqube.com/storage/';
  const defaultIconImage = 'https://uxwing.com/wp-content/themes/uxwing/download/banking-finance/wallet-to-bank-icon.png';

  // Dynamically set the selected icon image
  useEffect(() => {
    if (state.selectIconId) {
      setIconId(state.selectIconId);
      setSelectIconImage(state.selectIconImage ? `${BASE_URL}${state.selectIconPath}` : defaultIconImage);
    }
    if (state.selectCurrencyCode) {
      setCurrencyCode(state.selectCurrencyCode);
    }
  }, [state.selectIconId, state.selectIconPath, state.selectCurrencyCode]);

  const handleSave = async () => {
    if (!walletName || !currencyCode || !iconId || !balance) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.put(`/wallets/${data.id}?user_id=${state.userId}`, {
        user_id: state.userId,
        icon_id: iconId,
        name: walletName,
        balance: parseFloat(balance),
        currency: currencyCode,
      });

      Alert.alert('Success', 'Wallet updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating wallet:', error);

      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors).flat()[0];
        Alert.alert('Validation Error', firstError);
      } else if (error.response && error.response.status === 500) {
        Alert.alert('Server Error', 'There is an issue with the server. Please try again later.');
      } else {
        Alert.alert('Error', 'Network error. Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4 flex-1" style={{ backgroundColor: theme.primary }}>
      <View className="p-2" style={[styles.row, { backgroundColor: theme.secondary }]}>
        <TouchableRipple onPress={() => navigation.navigate('SelectItonsTabs')}>
          <Image
            source={{ uri: selectIconImage || defaultIconImage }}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableRipple>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Wallet Name"
          placeholderTextColor={theme.subtext}
          value={walletName}
          onChangeText={setWalletName}
        />
      </View>

      <TouchableRipple
        onPress={() => navigation.navigate('Currency')}
        rippleColor="rgba(0, 0, 0, .32)"
        style={[styles.touchableRipple, { backgroundColor: theme.secondary, borderColor: theme.border }]}
        className="p-3"
      >
        <View className="space-x-3" style={styles.touchableContent}>
          <MaterialIcons color={theme.text} name="currency-exchange" size={22} />
          <Text style={{ marginLeft: 5, color: theme.text }}>{currencyCode}</Text>
        </View>
      </TouchableRipple>

      <SaveButton title="Update" onPress={handleSave} loading={isLoading} />
    </View>
  );
};

export default EditWallet;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
});
