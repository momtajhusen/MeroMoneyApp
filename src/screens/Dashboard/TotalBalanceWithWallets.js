import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { rw, rh, rf } from '../../themes/responsive';

const TotalBalanceWithWallets = () => {
  const { state } = useContext(AppContext);
  const [walletData, setWalletData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showTotalBalance, setShowTotalBalance] = useState(true);
  const [showWalletBalances, setShowWalletBalances] = useState(true);

  const { theme } = useTheme();
  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  // Fetch wallet data and calculate total balance
  const fetchWalletData = async () => {
    try {
      // setRefreshing(true); // Start refreshing indicator
      const response = await apiClient.get(`/wallets?user_id=${state.userId}`);
      const wallets = response.data;
      setWalletData(wallets);

      // Calculate the total balance without conversion
      const total = wallets.reduce((acc, wallet) => {
        const balance = parseFloat(wallet.balance); // Ensure balance is a number
        return acc + balance; // Directly add the balance without conversion
      }, 0);

      setTotalBalance(total); // Set the total balance
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setRefreshing(false); // Stop refreshing indicator
    }
  };

  // Define onRefresh function
  const onRefresh = () => {
    fetchWalletData();
  };

    // Use focus effect to fetch data when component is focused
    useFocusEffect(
      useCallback(() => {
        fetchWalletData();
      }, [state.reFresh])
    );

  const renderItem = ({ item }) => {
    const balance = parseFloat(item.balance);
    const formattedBalance =
      balance % 1 === 0 ? balance.toFixed(0) : balance.toFixed(2);
  
    return (
      <View style={styles.walletContainer}>
        <Image 
          source={{ uri: `${BASE_URL}${item.icon_path}` }} 
          style={styles.walletIcon} 
        />
        <Text style={[styles.walletBalance, { color: theme.text }]}>
          {showWalletBalances ? `${item.currency_symbols} ${formattedBalance}` : `${item.currency_symbols} ******`}
        </Text>
      </View>
    );
  };

  const toggleVisibility = () => {
    setShowTotalBalance(prev => !prev);
    setShowWalletBalances(prev => !prev);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.secondary }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
 
      <View>
        <TouchableOpacity onPress={toggleVisibility} style={styles.balanceToggle}>
          <Text style={[styles.totalBalance, { color: theme.text }]}>
            {showTotalBalance ? `${totalBalance}` : `******`}
          </Text>
        </TouchableOpacity>

        {/* Eye icon toggling visibility */}
        <TouchableOpacity className="space-x-2" onPress={toggleVisibility} style={styles.eyeIconContainer}>
            <Text style={[styles.balanceLabelText, { color: theme.text }]}>Total Balance</Text>
          <MaterialIcons
            name={showTotalBalance ? 'visibility' : 'visibility-off'}
            size={rw(5)}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

        


        <FlatList
          data={walletData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.flatListContainer}
          ListEmptyComponent={<Text style={[styles.emptyMessage, { color: theme.text }]}>No wallets available.</Text>}
        />
      </View>
    </View>
  );
};

// Responsive styles
const styles = StyleSheet.create({
  container: {
    padding: rw(2),
    borderRadius: 5,
  },
  header: {
    padding: rw(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  },
  balanceToggle: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  totalBalance: {
    fontSize: rf(3.5),
    fontWeight: 'bold',
  },
  balanceLabel: {
    flexDirection: 'row',
    // marginTop: rh(0.5),
  },
  balanceLabelText: {
    fontSize: rf(1.5),
  },
  walletContainer: {
    justifyContent: 'center',
    marginRight: rw(3),
  },
  walletIcon: {
    width: rw(10),
    height: rw(10),
    borderRadius: 5,
  },
  walletBalance: {
    fontSize: rf(1.3),
    marginTop: rh(0.5),
  },
  flatListContainer: {
    paddingHorizontal: rw(4),
  },
  emptyMessage: {
    fontSize: rf(1.5),
  },
  eyeIconContainer: {
    flexDirection: 'row',
  },
});

export default TotalBalanceWithWallets;

