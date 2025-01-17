import React, {useContext, useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import NoteSelector from '../../components/NoteSelector';
import { rw, rh } from '../../themes/responsive';
import { AppContext } from '../../context/AppContext';


const BalanceTransfer = ({navigation}) => {
  const { theme } = useTheme();
  const { state, dispatch } = useContext(AppContext);
  

  const [walletData, setWalletData] = useState([]);
  const [fromWallet, setFromWallet] = useState(null);
  const [toWallet, setToWallet] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [openFromDropdown, setOpenFromDropdown] = useState(false);
  const [openToDropdown, setOpenToDropdown] = useState(false);

  const fromWalletShake = useRef(new Animated.Value(0)).current;
  const toWalletShake = useRef(new Animated.Value(0)).current;
  const amountShake = useRef(new Animated.Value(0)).current;

  const shakeAnimation = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -5, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 5, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const fetchWalletData = async () => {
    try {
      const response = await apiClient.get('/wallets');
      setWalletData(
        response.data.map((wallet) => ({
          label: `${wallet.name} (${wallet.currency_symbols}${wallet.balance})`,
          value: wallet.id,
          icon: () => (
            <MaterialIcons name="account-balance-wallet" size={20} color={theme.text} />
          ),
        }))
      );
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const validateTransfer = () => {
    let isValid = true;
    if (!fromWallet) {
      shakeAnimation(fromWalletShake);
      isValid = false;
    }
    if (!toWallet) {
      shakeAnimation(toWalletShake);
      isValid = false;
    }
    if (fromWallet === toWallet) {
      isValid = false;
    }
    if (!transactionAmount || isNaN(transactionAmount) || transactionAmount <= 0) {
      shakeAnimation(amountShake);
      isValid = false;
    }
    return isValid;
  };

  const handleTransfer = async () => {
    if (!validateTransfer()) return;
  
    const now = new Date();
    if (selectedDate > now) {
      Alert.alert('Error', 'The selected date cannot be in the future.');
      return;
    }
  
    const payload = {
      from_wallet_id: fromWallet,
      to_wallet_id: toWallet,
      amount: transactionAmount,
      date: selectedDate.toISOString(),  
      reason: state.transactionNote,
    };
  
    setIsLoading(true);
    try {
      const response = await apiClient.post('/wallets/transfer', payload);
  
      Alert.alert('Success', response.data.message);
      setTransactionAmount('');
      setSelectedDate(new Date());
      setFromWallet(null);
      setToWallet(null);
    } catch (error) {
      console.error('Transfer failed:', error.response?.data || error.message);
  
      if (error.response?.data?.errors?.date) {
        Alert.alert('Error', error.response.data.errors.date[0]);
      } else {
        Alert.alert('Error', 'Failed to transfer balance. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Text style={[styles.title, { color: theme.text }]}>Balance Transfer</Text>

      <Animated.View
        style={[
          styles.walletSelection,
          { transform: [{ translateX: fromWalletShake }], zIndex: 3000 },
        ]}
      >
        <DropDownPicker
          open={openFromDropdown}
          value={fromWallet}
          items={walletData}
          setOpen={setOpenFromDropdown}
          setValue={setFromWallet}
          setItems={setWalletData}
          placeholder="Select Source Wallet"
          placeholderStyle={{ color: theme.text }}
          style={{ backgroundColor: theme.secondary }}
          dropDownContainerStyle={{ backgroundColor: theme.secondary }}
          textStyle={{ color: theme.text }}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </Animated.View>

      <MaterialIcons name="import-export" size={24} color={theme.text} />

      <Animated.View
        style={[
          styles.walletSelection,
          { transform: [{ translateX: toWalletShake }], zIndex: 2500 },
        ]}
      >
        <DropDownPicker
          open={openToDropdown}
          value={toWallet}
          items={walletData}
          setOpen={setOpenToDropdown}
          setValue={setToWallet}
          setItems={setWalletData}
          placeholder="Select Destination Wallet"
          placeholderStyle={{ color: theme.text }}
          style={{ backgroundColor: theme.secondary }}
          dropDownContainerStyle={{ backgroundColor: theme.secondary }}
          textStyle={{ color: theme.text }}
          zIndex={2500}
          zIndexInverse={1500}
        />
      </Animated.View>

      <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
        <Text style={{ color: theme.text }}>
          {selectedDate ? selectedDate.toDateString() : 'Select Date'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={{ width: rw(90), marginBottom: rh(2), zIndex: 2000 }}>
      <NoteSelector
        onPress={() => navigation.navigate('Note')}
        note={state.transactionNote}
      />
      </View>

      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ translateX: amountShake }], zIndex: 1000 },
        ]}
      >
        <TextInput
          style={[styles.input, { borderColor: theme.text, color: theme.text }]}
          placeholder="Enter Amount"
          placeholderTextColor={theme.text}
          keyboardType="numeric"
          value={transactionAmount}
          onChangeText={setTransactionAmount}
        />
      </Animated.View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={handleTransfer}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <Text style={{ color: theme.text }}>Transfer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  walletSelection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginVertical: 16,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButton: {
    marginVertical: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: theme => theme.text,
  },
});

export default BalanceTransfer;
