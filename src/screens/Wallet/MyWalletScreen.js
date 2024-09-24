import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableHighlight, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WalletList from '../../components/common/WalletList';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { lightTheme, darkTheme } from '../../themes'; 

const Wallet = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme;

  const BASE_URL = 'https://finance.scriptqube.com/storage/';
  const [walletData, setWalletData] = useState([]);

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
    try {
      // Show confirmation before deletion
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
                // Corrected URL syntax
                const response = await apiClient.delete(`/wallets/${walletId}?user_id=${state.userId}`);
  
                console.log(response.data);
                
                // If the delete was successful, update the Wallet state
                if (response.status === 204) {
                  Alert.alert("Wallet deleted successfully");
                  fetchWalletData();
                } else {
                  Alert.alert("Failed to delete Wallet");
                }
              } catch (error) {
                if (error.response && error.response.data) {
                  // Log detailed error data
                  console.error('Error response data:', error.response.data);
  
                  // Show server error message
                  Alert.alert("Message", error.response.data.error || "An unexpected error occurred.");
                } else {
                  // Handle any other errors
                  Alert.alert("Error", "An unexpected error occurred.");
                }
                console.error('Error deleting Wallet:', error);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting icon:", error);
      Alert.alert("Error", "Could not delete the icon. Please try again.");
    }
  };
  
  

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <View style={[styles.container, { padding: 8, backgroundColor: themeColor.primary }]}>
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
              onPressEdit={() => navigation.navigate('EditWallet')}
              rightIcon={true}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center p-4">
             <Text style={{ color: themeColor.text }}>No wallet data available.</Text>
          </View>
        )}
      </View>

      <View style={styles.iconContainer}>
        <TouchableHighlight
          onPress={() => { navigation.navigate('AddWallets') }}
          style={{ borderRadius: 100, borderWidth: 1, borderColor: themeColor.accent, padding: 8 }}
          underlayColor="rgba(0,0,0,0.1)"
        >
          <MaterialIcons
            name="add"
            size={30}
            color={themeColor.accent}
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




