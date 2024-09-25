import React,{useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import  { useTheme } from '../themes/ThemeContext';

const WalletSelector = ({ onPress, walletName }) => {

  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  return (
    <TouchableOpacity className="mb-0.5" onPress={onPress}>
      <View className="space-x-4 py-4" style={[styles.walletContainer, {backgroundColor:theme.secondary}]}>
        <MaterialIcons color="black" name="account-balance-wallet" size={22} style={{color:theme.text}} />
        <Text className="font-bold" style={[styles.text, {color:theme.text}]}>{walletName || "Wallet"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});

export default WalletSelector;
