import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import CategorySelector from '../../components/CategorySelector';
import NoteSelector from '../../components/NoteSelector';
import WalletSelector from '../../components/WalletSelector';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import CustomAlert from '../../components/common/CustomAlert';
import { rw, rh, rf } from '../../themes/responsive';

const ViewTransaction = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route.params;
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const WalletIcon = 'https://finance.scriptqube.com/storage/' + data.wallets_icon;

  const [isModalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);

  const amountTextColor = data.transaction_type === 'Expense' ? '#b02305' : '#169709';
  const date = new Date(data.transaction_date);
  const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedTime = `${date.getHours() % 12 || 12}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;

  const deleteTransactionData = async (transactionId) => {
    setModalVisible(false);
    setLoading(true);

    try {
      const response = await apiClient.delete(`/transactions/${transactionId}`);
      const message = response.status === 200 ? 'Transaction deleted successfully.' : 'Failed to delete the transaction.';

      setAlertMessage(message);
      setAlertType(response.status === 200 ? 'success' : 'error');
      setAlertVisible(true);

      setTimeout(() => {
        navigation.navigate('Transactions');
      }, 2000);

      dispatch({ type: 'GLOBAL_REFRESH', payload: Math.random() });
    } catch (error) {
      setAlertMessage(error.response?.data?.error || 'An error occurred while deleting the transaction.');
      setAlertType('error');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    deleteTransactionData(data.id);
  };

  useEffect(() => {
    dispatch({
      type: 'SET_WALLET',
      payload: {
        walletId: data.wallet_id,
        walletName: data.wallets_name,
        walletImage: data.wallets_icon,
      },
    });
    dispatch({
      type: 'SET_CATEGORY',
      payload: {
        categoryId: data.category_id,
        categoryName: data.transaction_category_name,
        categoryImage: `https://finance.scriptqube.com/storage/${data.categories_icon}`,
      },
    });
    dispatch({ type: 'SET_CATEGORY_SELECT_TYPE', payload: data.transaction_type });
    
  }, []);

  const UpdateNavigate = () => {
    dispatch({
      type: 'SET_CATEGORY',
      payload: {
        categoryId: data.category_id,
        categoryName: data.transaction_category_name,
        categoryImage: `https://finance.scriptqube.com/storage/${data.categories_icon}`,
      },
    });
    dispatch({
      type: 'SET_WALLET',
      payload: {
        walletId: data.wallet_id,
        walletName: data.wallets_name,
        walletImage: data.wallets_icon,
      },
    });
    dispatch({
      type: 'TRANSCTION_DATA',
      payload: {
        transactionId: data.id,
        transactionAmount: data.amount,
        transactionNote: data.note,
        transactionDate: data.transaction_date,
      },
    });
    navigation.navigate('UpdateTransaction');
  };

  return (
    <View style={{ backgroundColor: theme.primary, padding: 16, flex: 1 }}>
      <View style={{ backgroundColor: theme.secondary, padding: 16, marginBottom: 8 }}>
        <Text style={{ color: theme.text }}>Amount</Text>
        <Text style={{ fontSize: 25, color: amountTextColor, fontWeight: 'bold' }}>{data.amount}</Text>
      </View>
      <CategorySelector categoryImage={state.categoryIcon} categoryName={data.transaction_category_name} />
      <WalletSelector walletName={data.wallets_name} walletImage={WalletIcon} />
      <NoteSelector note={data.note} />
      <View style={{ backgroundColor: theme.secondary, padding: 8 }}>
        <Text style={{ color: theme.text }}>Date</Text>
        <Text style={{ color: theme.text, fontWeight: 'bold' }}>{formattedDate}</Text>
      </View>
      <View style={{ backgroundColor: theme.secondary, padding: 8 }}>
        <Text style={{ color: theme.text }}>Time</Text>
        <Text style={{ color: theme.text, fontWeight: 'bold' }}>{formattedTime}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ backgroundColor: theme.secondary, flex: 1, padding: 12 }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.text} />
          ) : (
            <Text style={{ color: theme.text, textAlign: 'center', fontWeight: 'bold' }}>
              <MaterialIcons name="delete" size={24} color={theme.text} />
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={UpdateNavigate}
          style={{ backgroundColor: theme.secondary, flex: 1, padding: 12, marginLeft: 8 }}
        >
          <Text style={{ color: theme.text, textAlign: 'center', fontWeight: 'bold' }}>
            <MaterialIcons name="edit" size={24} color={theme.text} />
          </Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={isModalVisible}
        title="Confirm Delete"
        message="Are you sure you want to delete this transaction?"
        confirmText="Delete"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleDelete}
        theme={theme}
        type="warning"
      />

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

export default ViewTransaction;
