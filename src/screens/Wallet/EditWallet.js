import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import apiClient from '../../../apiClient'; // Import your API client
import { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';
import CustomAlert from '../../components/common/CustomAlert';

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

  // State for alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    if (state.walletId) {
      setIconId(state.selectIconId);
      setSelectIconImage(state.selectIconImage);

      console.log(state.selectIconImage);
    } else {
      setSelectIconImage(data.selectIconImage);
    }

    if (state.selectCurrencyCode) {
      setCurrencyCode(state.selectCurrencyCode);
    }
  }, [state.selectIconId, state.selectIconId, state.selectCurrencyCode]);

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
        currency: state.selectCurrencyId,
      });

      setAlertMessage('Wallet updated successfully!');
      setAlertType('success');
      setAlertVisible(true);

      setTimeout(() => {
          navigation.goBack();
      }, 2000);

    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors).flat()[0];
        setAlertMessage(firstError);
        setAlertType('error');
        setAlertVisible(true);
      } else if (error.response && error.response.status === 500) {
        setAlertMessage('There is an issue with the server. Please try again later.');
        setAlertType('error');
        setAlertVisible(true);
      } else {
        setAlertMessage('Network error. Please check your internet connection and try again.');
        setAlertType('error');
        setAlertVisible(true);
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
            source={{ uri: selectIconImage}}
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