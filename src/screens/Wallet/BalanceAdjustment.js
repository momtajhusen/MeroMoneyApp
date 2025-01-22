import React, {useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Animated
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';
import apiClient from '../../../apiClient';

const BalanceAdjustment = () => {
  const { theme } = useTheme();
  const [walletData, setWalletData] = useState([]);
  const [walletId, setWalletId] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(''); // Current wallet balance
  const [adjustmentType, setAdjustmentType] = useState(null); // Credit/Debit
  const [amount, setAmount] = useState(''); // Adjustment amount
  const [reason, setReason] = useState(''); // Adjustment reason
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWalletBalance, setSelectedWalletBalance] = useState(null);

  // Dropdown open states
  const [openWalletDropdown, setOpenWalletDropdown] = useState(false);
  const [openTypeDropdown, setOpenTypeDropdown] = useState(false);

  const WalletSelect = useRef(new Animated.Value(0)).current;
  const CurrentBalance = useRef(new Animated.Value(0)).current;
  const AdjustmentSelect = useRef(new Animated.Value(0)).current;
  const EnterAmount = useRef(new Animated.Value(0)).current;


  const shakeAnimation = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -5, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 5, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      const response = await apiClient.get('/wallets');
      setWalletData(
        response.data.map((wallet) => ({
          label: `${wallet.name} (${wallet.balance})`,
          value: wallet.id,
          balance: wallet.balance,
        }))
      );
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet data.');
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleWalletSelection = (value) => {
    if (value === null) {
      return; // Skip processing if value is null
    }

    console.log("Selected Wallet ID:", value);
    setWalletId(value);

    const selectedWallet = walletData.find((wallet) => wallet.value === value);
    if (selectedWallet) {
      setSelectedWalletBalance(selectedWallet.balance);  
      setCurrentBalance(selectedWallet.balance.toString());
      setAdjustmentType(null);
      setAmount('');
    } else {
      console.error("Wallet not found for the selected value:", value);
    }
  };

  const handleCurrentBalanceChange = (newBalance) => {
    if (!newBalance || parseFloat(newBalance) === 0) {
      // Reset states if new balance is empty or 0
      setAdjustmentType(null);
      setAmount('');
      setCurrentBalance(newBalance);
      return;
    }
  
    const updatedBalance = parseFloat(newBalance);
    const initialBalance = parseFloat(selectedWalletBalance);
  
    if (!isNaN(updatedBalance) && !isNaN(initialBalance)) {
      if (updatedBalance > initialBalance) {
        setAdjustmentType('credit');
        setAmount((updatedBalance - initialBalance).toFixed(2));
      } else if (updatedBalance < initialBalance) {
        setAdjustmentType('debit');
        setAmount((initialBalance - updatedBalance).toFixed(2));
      } else {
        setAdjustmentType(null);
        setAmount('');
      }
    }
  
    setCurrentBalance(newBalance);
  };
  
  const handleAmountChange = (newAmount) => {
    if (!newAmount || parseFloat(newAmount) === 0) {
      // Reset states if amount is empty or 0
      setCurrentBalance(selectedWalletBalance.toString());
      setAmount('');
      return;
    }
  
    const amountValue = parseFloat(newAmount);
    const initialBalance = parseFloat(selectedWalletBalance);
  
    if (!isNaN(amountValue) && !isNaN(initialBalance)) {
      if (adjustmentType === 'credit') {
        setCurrentBalance((initialBalance + amountValue).toFixed(2));
      } else if (adjustmentType === 'debit') {
        setCurrentBalance((initialBalance - amountValue).toFixed(2));
      }
    }
    setAmount(newAmount);
  };
  
  // Handle adjustment submission
  const handleAdjustment = async () => {
    if (!walletId || !adjustmentType || !amount) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    const payload = {
      wallet_id: walletId,
      adjustment_type: adjustmentType,
      amount: parseFloat(amount),
      reason: reason || 'Manual adjustment',
    };

    setIsLoading(true);
    try {
      const response = await apiClient.post('/wallet/balance-adjustment', payload);
      Alert.alert(
        'Success',
        response.data.message || 'Balance adjustment successful.'
      );
      setWalletId(null);
      setAdjustmentType(null);
      setAmount('');
      setReason('');
      setCurrentBalance('');
    } catch (error) {
      console.error('Adjustment failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to adjust balance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
<View style={[styles.container, { backgroundColor: theme.primary }]}>
  {/* Wallet Selection Dropdown */}
  <DropDownPicker
    open={openWalletDropdown}
    value={walletId}
    items={walletData}
    setOpen={setOpenWalletDropdown}
    setValue={setWalletId}
    onChangeValue={handleWalletSelection}
    setItems={setWalletData}
    placeholder="Select Wallet"
    placeholderStyle={{ color: theme.subtext }}
    style={{ backgroundColor: theme.secondary }}
    dropDownContainerStyle={{ backgroundColor: theme.secondary }}
    textStyle={{ color: theme.text }}
    zIndex={3000}
    zIndexInverse={1000}
  />

  {/* Wallet Current Balance Input */}
  <TextInput
    style={[styles.input, { borderColor: theme.border, color: theme.text }]}
    placeholder="Wallet Current Balance"
    placeholderTextColor={theme.subtext}
    keyboardType="numeric"
    value={currentBalance}
    onChangeText={handleCurrentBalanceChange}
  />

  {/* Adjustment Type Dropdown */}
  <DropDownPicker
    open={openTypeDropdown}
    value={adjustmentType}
    items={[
      { label: 'Credit', value: 'credit' },
      { label: 'Debit', value: 'debit' },
    ]}
    setOpen={setOpenTypeDropdown}
    setValue={setAdjustmentType}
    placeholder="Select Adjustment Type"
    placeholderStyle={{ color: theme.subtext }}
    style={{ backgroundColor: theme.secondary }}
    dropDownContainerStyle={{ backgroundColor: theme.secondary }}
    textStyle={{ color: theme.text }}
    zIndex={200}
    zIndexInverse={1000}
  />

  {/* Enter Amount Input */}
  <TextInput
    style={[styles.input, { borderColor: theme.border, color: theme.text }]}
    placeholder="Enter Amount"
    placeholderTextColor={theme.subtext}
    keyboardType="numeric"
    value={amount}
    onChangeText={handleAmountChange}
  />

  {/* Reason Input */}
  <TextInput
    style={[styles.input, { borderColor: theme.border, color: theme.text }]}
    placeholder="Reason (optional)"
    placeholderTextColor={theme.subtext}
    value={reason}
    onChangeText={setReason}
  />

  {/* Save Button */}
  <SaveButton onPress={handleAdjustment} loading={isLoading} />
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default BalanceAdjustment;
