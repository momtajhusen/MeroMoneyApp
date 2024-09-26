import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import apiClient from '../../../apiClient';
import CustomInput from '../../components/CustomInput';
import CategorySelector from '../../components/CategorySelector';
import NoteSelector from '../../components/NoteSelector';
import DatePicker from '../../components/DatePicker';
import WalletSelector from '../../components/WalletSelector';
import SaveButton from '../../components/SaveButton';
import  { useTheme } from '../../themes/ThemeContext';


const AddTransaction = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const [transactionAmount, setTransactionAmount] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);

  const textInputRef = useRef(null);

  const CategorySelect = () => {
    dispatch({ type: 'SET_CATEGORY_NAVIGATION', payload: 'AddTransactions' });
    navigation.navigate('Categories');
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const TransactionSave = async () => {
    const user_id = state.userId;
    const wallet_id = state.walletId;
    const category_id = state.categoryId;
    const amount = transactionAmount;
    const note = state.transactionNote;
    const transaction_date = selectedDate;
  
    // Sequential validation
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
  
    try {
      setIsLoading(true); // Start loading
      const response = await apiClient.post('/transactions', payload);
      if (response.status === 201) {
        Alert.alert('Success', 'Transaction saved successfully.');
        // Clear the state using dispatch
        dispatch({ type: 'SET_CATEGORY', payload: { categoryId: null, categoryName: null, categoryImage: null } });
        dispatch({ type: 'TRANSCTION_NOTE', payload: null });
        dispatch({ type: 'SET_WALLET', payload: { walletId: null, walletName: null } });
        navigation.navigate('Transactions');
      } else {
        Alert.alert('Error', 'Failed to save the transaction.');
      }
    } catch (error) {
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

  return (
    <View style={[styles.container, {backgroundColor:theme.primary}]}>
      <CustomInput
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
        onPress={TransactionSave} 
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

export default AddTransaction;
