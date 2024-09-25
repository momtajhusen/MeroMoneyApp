import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WalletList from '../../components/common/WalletList';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import  { useTheme } from '../../themes/ThemeContext';



const SelectWallet = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme(); 
 
  // Base URL for your API or CDN
  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  const [walletData, setWalletData] = useState([]);

  // Function to fetch wallet data
  const fetchWalletData = async () => {
    try {
      const response = await apiClient.get(`/wallets?user_id=${state.userId}`); // Add user_id as needed
      setWalletData(response.data); // Adjust based on API response structure
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [state.userId]); // Only fetch data when userId changes

  const handleWalletClick = (walletId, walletName) => {
    dispatch({ type: 'SET_WALLET', payload: { walletId, walletName } });
    navigation.goBack();
  };

  return (
    <View className="p-4 flex-1" style={{backgroundColor:theme.primary}}>
      {/* Wallet List Items */}
      <View className="flex-1">
        {walletData.length > 0 ? (
          walletData.map((wallet) => (
            <WalletList
              key={wallet.id} // Use a unique key
              imageIcon={`${BASE_URL}${wallet.icon_path}`} // Assuming wallet data includes an icon field
              title={wallet.name} // Assuming wallet data includes a name field
              balance={`${wallet.currency} ${wallet.balance}`} // Assuming wallet data includes a balance field
              onPress={() => handleWalletClick(wallet.id, wallet.name)} // Corrected onPress handler
              rightIcon={false}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center p-4">
             <Text style={{ color: theme.text }}>No wallet data available.</Text>
          </View>
        )}
      </View>
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
  addIconWrapper: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
  },
});

export default SelectWallet;
