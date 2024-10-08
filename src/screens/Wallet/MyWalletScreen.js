import React, { useState, useContext, useCallback } from 'react';
import { View, TouchableHighlight, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import WalletList from '../../components/common/WalletList';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';

const Wallet = () => {
  const navigation = useNavigation();
  const { state } = useContext(AppContext);

  const BASE_URL = 'https://finance.scriptqube.com/storage/';
  const [walletData, setWalletData] = useState([]);
  const { theme } = useTheme();

  const fetchWalletData = async () => {
    try {
      const response = await apiClient.get(`/wallets?user_id=${state.userId}`);
      console.log(response.data);
      setWalletData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onPressDelete = (walletId) => {
    Alert.alert(
      "Delete Wallet",
      "Are you sure you want to delete this Wallet?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await apiClient.delete(`/wallets/${walletId}?user_id=${state.userId}`);

              if (response.status === 204) {
                Alert.alert("Wallet deleted successfully");
                fetchWalletData();
              } else {
                Alert.alert("Failed to delete Wallet");
              }
            } catch (error) {
              if (error.response && error.response.data) {
                console.error('Error response data:', error.response.data);
                Alert.alert("Message", error.response.data.error || "An unexpected error occurred.");
              } else {
                Alert.alert("Error", "An unexpected error occurred.");
              }
              console.error('Error deleting Wallet:', error);
            }
          },
        },
      ]
    );
  };

  // Use useFocusEffect to fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [])
  );

  return (
    <View style={[styles.container, { padding: 8, backgroundColor: theme.primary }]}>
      <View className="flex-1">
        {walletData.length > 0 ? (
          walletData.map((wallet) => (
            <WalletList
              key={wallet.id}
              imageIcon={`${BASE_URL}${wallet.icon_path}`}
              title={wallet.name}
              balance={`${wallet.currency} ${wallet.balance}`}
              onPress={() => console.log(`${wallet.name} pressed!`)}
              onPressDelete={() => onPressDelete(wallet.id)}
              onPressEdit={() => navigation.navigate('EditWallet', { data: wallet })}
              rightIcon={true}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center p-4">
            <Text style={{ color: theme.text }}>No wallet data available.</Text>
          </View>
        )}
      </View>

      <View style={styles.iconContainer}>
        <TouchableHighlight
          onPress={() => navigation.navigate('AddWallets')}
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
