import React, { useState, useContext, useCallback } from 'react';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import WalletList from '../../components/common/WalletList';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';
import CustomAlert from '../../components/common/CustomAlert';

const Wallet = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);

  const BASE_URL = 'https://finance.scriptqube.com/storage/';
  const [walletData, setWalletData] = useState([]);
  const { theme } = useTheme();

  const [isModalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [walletToDelete, setWalletToDelete] = useState(null);

  const fetchWalletData = async () => {
    try {
      const response = await apiClient.get('/wallets');
      setWalletData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onPressDelete = (walletId) => {
    setWalletToDelete(walletId);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!walletToDelete) return;
    try {
      const response = await apiClient.delete(`/wallets/${walletToDelete}`);
      if (response.status === 204) {
        setAlertType('success');
        setAlertMessage("Wallet deleted successfully");
        fetchWalletData();
      } else {
        setAlertType('error');
        setAlertMessage("Failed to delete Wallet");
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.error || "An unexpected error occurred.");
      setAlertType('error');
      console.error('Error deleting Wallet:', error);
    } finally {
      setModalVisible(false);
      setAlertVisible(true);
      setWalletToDelete(null);
    }
  };

  const onPressEdit = (wallet) => {
    dispatch({ type: 'SET_ICON_ID', payload: wallet.icon_id });
    dispatch({ type: 'SET_ICON_IMAGE', payload: BASE_URL + wallet.icon_path });
    dispatch({ type: 'SET_CURRENCY_CODE', payload: wallet.currency_code });
    navigation.navigate('EditWallet', { data: wallet });
  };

  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [])
  );

  const AddWalletsNavigation = () => {
    navigation.navigate('AddWallets');
    dispatch({ type: 'SET_WALLET', payload: { walletId: null, walletName: null, walletImage: null } });
    dispatch({ type: 'SET_ICON_IMAGE', payload: null });
  };

  return (
<View style={[styles.container, { padding: 8, backgroundColor: theme.primary }]}>
  <View style={{ flex: 1 }}>
    {walletData.length > 0 ? (
      walletData.map((wallet) => {
        // Format the balance
        const formattedBalance = parseFloat(wallet.balance).toFixed(2);
        const displayBalance = formattedBalance.endsWith('.00') ? parseInt(formattedBalance).toString() : formattedBalance;

        return (
          <WalletList
            key={wallet.id}
            imageIcon={`${BASE_URL}${wallet.icon_path}`}
            title={wallet.name}
            balance={`${wallet.currency_symbols} ${displayBalance}`} 
            onPress={() => console.log(`${wallet.name} pressed!`)}
            onPressDelete={() => onPressDelete(wallet.id)}
            onPressEdit={() => onPressEdit(wallet)}
            rightIcon={true}
          />
        );
      })
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4 }}>
        <Text style={{ color: theme.text }}>No wallet data available.</Text>
      </View>
    )}
  </View>

  <View style={styles.iconContainer}>
    <TouchableHighlight
      onPress={AddWalletsNavigation}
      style={{ borderRadius: 100, borderWidth: 1, borderColor: theme.accent, padding: 8 }}
      underlayColor="rgba(0,0,0,0.1)"
    >
      <MaterialIcons
        name="add"
        size={30}
        color={theme.accent}
      />
    </TouchableHighlight>
  </View>

  {/* CustomAlert for delete confirmation */}
  <CustomAlert
    visible={isModalVisible}
    title="Confirm Delete"
    message="Are you sure you want to delete this wallet?"
    confirmText="Delete"
    onCancel={() => setModalVisible(false)}
    onConfirm={handleDelete}
    theme={theme}
    type='warning'
  />

  {/* CustomAlert for success/error messages */}
  <CustomAlert
    visible={alertVisible}
    title={alertType === 'success' ? "Success" : "Error"}
    message={alertMessage}
    confirmText="OK"
    onOk={() => setAlertVisible(false)}
    theme={theme}
    type={alertType}
  />
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    padding: 16,
    alignItems: 'flex-end',
  },
});

export default Wallet;
