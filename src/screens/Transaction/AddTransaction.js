import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, StyleSheet, Alert, Animated, textInputRef } from 'react-native';
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
import { useTheme } from '../../themes/ThemeContext';
import CustomAlert from '../../components/common/CustomAlert';

const AddTransaction = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

    // State for alert
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

  const [transactionAmount, setTransactionAmount] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Animated values for shake effects
  const amountShake = useRef(new Animated.Value(0)).current;
  const categoryShake = useRef(new Animated.Value(0)).current;
  const walletShake = useRef(new Animated.Value(0)).current;

  // Shake animation function
  const shakeAnimation = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -5, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 5, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
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


    // Sequential validation with shake animations
    if (!amount || isNaN(amount)) {
      shakeAnimation(amountShake);
      return;
    }

    if (!category_id) {
      shakeAnimation(categoryShake);
      return;
    }

    if (!wallet_id) {
      shakeAnimation(walletShake);
      return;
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      user_id,
      wallet_id,
      category_id,
      amount: parseFloat(amount),
      note,
      transaction_date,
      attachment_url: null,
      exchange_rate_to_base: null,
      timezone: userTimezone, 
    };

    
 

    try {
      setIsLoading(true);
      const response = await apiClient.post('/transactions', payload);

      console.log(response.data);

      if (response.status === 201) {

        // Handle success response
        setAlertMessage('Transaction saved successfully.');
        setAlertType('success');
        setAlertVisible(true);

        setTransactionAmount(null);
        dispatch({ type: 'SET_CATEGORY', payload: { categoryId: null, categoryName: null, categoryImage: null } });
        dispatch({ type: 'TRANSCTION_NOTE', payload: null });
        dispatch({ type: 'SET_WALLET', payload: { walletId: null, walletName: null } });
        
        setTimeout(() => {
          setAlertVisible(false);
        }, 2000);

      } else {
        Alert.alert('Error', 'Failed to save the transaction.');
      }
    } catch (error) {
      Alert.alert('Message', error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      {/* Animated Input for Amount */}
      <Animated.View style={{ transform: [{ translateX: amountShake }] }}>
        <CustomInput
          value={transactionAmount}
          onChangeText={setTransactionAmount}
          placeholder="Amount"
          keyboardType="numeric"
        />
      </Animated.View>

      {/* Animated Category Selector */}
      <Animated.View style={{ transform: [{ translateX: categoryShake }] }}>
        <CategorySelector
          onPress={() => {
            dispatch({ type: 'SET_CATEGORY_NAVIGATION', payload: 'AddTransactions' });
            navigation.navigate('Categories');
          }}
          categoryImage={state.categoryIcon}
          categoryName={state.categoryName}
        />
      </Animated.View>

      {/* Animated Wallet Selector */}
      <Animated.View style={{ transform: [{ translateX: walletShake }] }}>
        <WalletSelector
          onPress={() => navigation.navigate('SelectWallet')}
          walletName={state.walletName}
          walletImage={state.walletImage}
        />
      </Animated.View>

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

      <SaveButton onPress={TransactionSave} loading={isLoading} />

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

export default AddTransaction;
