import React,{useContext, useEffect} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import CategorySelector from '../../components/CategorySelector';
import NoteSelector from '../../components/NoteSelector';
import WalletSelector from '../../components/WalletSelector';
import apiClient from '../../../apiClient';
import  { useTheme } from '../../themes/ThemeContext';


const ViewTransaction = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route.params;

  console.log(data.categories_icon);

  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();


  const amountTextColor = data.transaction_type === 'Expense' ? '#b02305' : data.transaction_type === 'Income' ? '#169709' : 'black';

  // Parse the transaction_date and format it
  const date = new Date(data.transaction_date);
  
  // Format date to 'DD MMM YYYY'
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-IN', options);
  
  // Format time to 'hh:mm AM/PM'
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;

  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  const deleteTransactionData = async (transactionId) => {
    try {
      // Send DELETE request to the API
      const response = await apiClient.delete(`/transactions/${transactionId}`); // Use the correct endpoint

      if (response.status === 200) {
        Alert.alert('Success', 'Transaction deleted successfully.');
      } else {
        Alert.alert('Error', 'Failed to delete the transaction.');
      }
    } catch (error) {
      console.error('Error deleting data:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response?.data?.error || 'An error occurred while deleting the transaction.');
    } finally {
      navigation.navigate('Transactions');
    }
  };

  useEffect(() => {
    dispatch({ type: 'SET_CATEGORY', payload: {categoryId: data.category_id, categoryName:data.transaction_category_name, categoryImage:`${BASE_URL}${data.categories_icon}` } });
    dispatch({ type: 'SET_CATEGORY_SELECT_TYPE', payload:  data.type });
  }, []);

  return (
    <View className="p-4 flex-1" style={{backgroundColor:theme.primary}}>
      <View className="p-4 mb-1" style={{backgroundColor:theme.secondary}}>
        <Text style={{color:theme.text}}>Amount</Text>
        <Text className="font-bold" style={{ fontSize: 25, color: amountTextColor }}>
          {data.amount}
        </Text>
      </View>

      <CategorySelector
        categoryImage={state.categoryIcon}
        categoryName={data.transaction_category_name}
      />

      <WalletSelector walletName={data.wallets_name} />

      <NoteSelector note={data.note} />

      <View className="px-5 py-2" style={{backgroundColor:theme.secondary}}>
        <Text style={{color:theme.text}}>Date</Text>
        <Text className="font-bold" style={{color:theme.text}}>{formattedDate}</Text>
      </View>

      <View className="px-5 pb-2" style={{backgroundColor:theme.secondary}}>
        <Text style={{color:theme.text}}>Time</Text>
        <Text className="font-bold" style={{color:theme.text}}>{formattedTime}</Text>
      </View>

      <View className="flex-row space-x-6 mt-8">
        <TouchableOpacity
          className="p-3 flex-1"
          onPress={() => deleteTransactionData(data.id)}
          style={{backgroundColor:theme.secondary}}
        >
          <Text className="font-bold text-center" style={{color:theme.text}}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="p-3 flex-1"
          onPress={() => navigation.navigate('UpdateTransaction', { data })}
          style={{backgroundColor:theme.secondary}}
          >
          <Text className="font-bold text-center" style={{color:theme.text}}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
 

export default ViewTransaction;
