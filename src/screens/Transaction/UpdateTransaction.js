import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import CustomAlert from '../../components/common/CustomAlert';


const UpdateTransaction = () => {
  const BASE_URL = 'https://finance.scriptqube.com/storage/';
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();
  const navigation = useNavigation();

  // State for alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  // Use data directly from the context state
  const [transactionAmount, setTransactionAmount] = useState(state.transactionAmount || '');
  const [selectedDate, setSelectedDate] = useState(state.transactionDate ? new Date(state.transactionDate) : new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const textInputRef = useRef(null);

  useEffect(() => {
    // Focus on the amount input when component mounts
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const CategorySelect = () => {
    dispatch({ type: 'SET_CATEGORY_NAVIGATION', payload: 'UpdateTransaction' });
    navigation.navigate('Categories');
  };

  const TransactionUpdate = async () => {
    const user_id = state.userId;
    const wallet_id = state.walletId;
    const category_id = state.categoryId;
    const amount = transactionAmount;
    const note = state.transactionNote;
    const transaction_date = selectedDate.toISOString().split('T')[0];

    // Validate input fields
    if (!user_id || !amount || isNaN(amount) || !category_id || !wallet_id) {
      Alert.alert('Validation Error', 'Please fill out all required fields correctly.');
      return;
    }

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
      setIsLoading(true);
      const response = await apiClient.put(`/transactions/${state.transactionId}`, payload);

      console.log(response.data);
      // return false;

      if (response.status === 200) {
        setAlertMessage('Transaction updated successfully.');
        setAlertType('success');
        setAlertVisible(true);
        dispatch({ type: 'RESET_TRANSACTION' }); 
        setTimeout(() => {
          navigation.navigate('Transactions');
        }, 2000);
      } else {
        setAlertMessage('Failed to update the transaction.');
        setAlertType('error');
        setAlertVisible(true);
      }
    } catch (error) {
      console.error(error.response || error.message);
      setAlertMessage(error.response || error.message);
      setAlertType('error');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

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
        categoryImage={state.categoryImage}
        categoryName={state.categoryName}
      />

      <WalletSelector
        onPress={() => navigation.navigate('SelectWallet')}
        walletName={state.walletName}
        walletImage={state.walletImage}
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
      title="Update"
        onPress={TransactionUpdate}
        loading={isLoading}
      />

      {/* CustomAlert for success/error messages */}
      <CustomAlert
        visible={alertVisible}
        title={alertType === 'success' ? 'Success' : 'Error'}
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

export default UpdateTransaction;
