import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import apiClient from '../../../apiClient';
import InputField from '../../components/CustomInput';
import CategorySelector from '../../components/CategorySelector';
import NoteSelector from '../../components/NoteSelector';
import DatePicker from '../../components/DatePicker';
import WalletSelector from '../../components/WalletSelector';
import SaveButton from '../../components/SaveButton';
import { useTheme } from '../../themes/ThemeContext';

const UpdateTransaction = ({ route }) => {
  const { data } = route.params;

  const BASE_URL = 'https://finance.scriptqube.com/storage/';


  // Convert transactionDate to a JavaScript Date object
  const transactionDate = new Date(data.transaction_date);
 
  const categoryId = data.category_id;
  const categoryName = data.transaction_category_name;
  const categoryImage = `${BASE_URL}${data.categories_icon}`;
  const note = data.note;

  const walletId = data.wallet_id;
  const walletName = data.wallets_name;
  const walletIcon = data.wallets_icon;

  const { theme } = useTheme();
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);

  const [transactionAmount, setTransactionAmount] = useState(data.amount);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(transactionDate || new Date());
  const [isLoading, setIsLoading] = useState(false);

  const textInputRef = useRef(null);

  useEffect(() => {
    dispatch({ type: 'SET_CATEGORY', payload: { categoryId, categoryName, categoryImage } });
    dispatch({ type: 'TRANSCTION_NOTE', payload: note });
    dispatch({ type: 'SET_WALLET', payload: { walletId, walletName } });
  }, []);
  

  const CategorySelect = () => {
    dispatch({ type: 'SET_CATEGORY_NAVIGATION', payload: 'AddTransactions' });
    navigation.navigate('Categories');
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const TransactionUpdate = async () => {
    const user_id = state.userId;
    const wallet_id = state.walletId;
    const category_id = state.categoryId;
    const amount = transactionAmount;
    const note = state.transactionNote;
    const transaction_date = data.transaction_date;
  
    // Sequential Validation
    if (!user_id) {
      Alert.alert('Validation Error', 'User ID is required.');
      return;
    }
  
    if (!amount || isNaN(amount)) {
      Alert.alert('Validation Error', 'Please enter a valid amount.');
      return;
    }
  
    if (!category_id) {
      Alert.alert('Validation Error', 'Please select a category.');
      return;
    }
    if (!wallet_id) {
      Alert.alert('Validation Error', 'Please select a wallet.');
      return;
    }
  
    // Prepare the payload after validation
    const payload = {
      user_id,
      wallet_id,
      category_id,
      amount: parseFloat(amount),
      note,
      transaction_date,
      attachment_url: null,
      exchange_rate_to_base: null,
    };
  
    console.log(payload);
  
    try {
      setIsLoading(true); // Start loading
      const response = await apiClient.put(`/transactions/${data.id}`, payload); // Assuming PUT request for update
      console.log(response);
  
      if (response.status === 200) {
        Alert.alert('Success', 'Transaction updated successfully.');
  
        // Clear the state using dispatch
        dispatch({ type: 'SET_CATEGORY', payload: { categoryId: null, categoryName: null, categoryImage: null } });
        dispatch({ type: 'TRANSCTION_NOTE', payload: null });
        dispatch({ type: 'SET_WALLET', payload: { walletId: null, walletName: null } });
  
        // Navigate back to the 'Transactions' screen
        navigation.navigate('Transactions');
      } else {
        Alert.alert('Error', 'Failed to update the transaction.');
      }
    } catch (error) {
      console.log(error.response);
      Alert.alert('Message', error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Execute logic when screen comes into focus
      // Fetch the latest data if required
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <InputField
        value={transactionAmount}
        onChangeText={setTransactionAmount}
        placeholder="Amount"
        keyboardType="numeric"
        textInputRef={textInputRef}
      />

      <CategorySelector
        onPress={CategorySelect}
        categoryImage={state.categoryIcon}
        categoryName={state.categoryName}
      />

      <WalletSelector
        onPress={() => navigation.navigate('SelectWallet')}
        walletName={state.walletName}
      />

      <NoteSelector
        onPress={() => navigation.navigate('Note')}
        note={state.transactionNote}
      />

      <DatePicker
        selectedDate={selectedDate}
        onPress={() => setDatePickerVisibility(true)}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedDate}
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <SaveButton
        onPress={TransactionUpdate}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

export default UpdateTransaction;
