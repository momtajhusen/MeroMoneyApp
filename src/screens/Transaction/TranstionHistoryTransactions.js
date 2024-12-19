import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { AppContext } from '../../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format, startOfMonth,endOfMonth} from 'date-fns';
import * as Animatable from 'react-native-animatable';

import { rw, rh, rf } from '../../themes/responsive';

import {LinearGradient} from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);



const BASE_URL = 'https://finance.scriptqube.com/storage/';

const TransactionHistoryTransactions = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    const [transactionData, setTransactionData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [dateRange, setDateRange] = useState(null);


    const { state, dispatch } = useContext(AppContext);
    const { transactionFilter } = state;

    const fetchTransactionData = async () => {
        try {
          setIsLoading(true);
      
          // Retrieve the stored transaction dates
          const storedDates = await AsyncStorage.getItem('transaction_dates');
          const parsedDates = storedDates ? JSON.parse(storedDates) : {};
      
          // Set default start and end dates if not found in parsedDates
          const start_date = parsedDates.start_date || startOfMonth(new Date());
          const end_date = parsedDates.end_date || endOfMonth(new Date());
      
          // Retrieve the DateClickButton value, set default if null or key not found
          const DateClickButton = await AsyncStorage.getItem('DateClickButton') || 'This Month';
      
          // Fetch transaction data from API
          const response = await apiClient.get('/transactions', {
            params: {
              start_date: start_date,
              end_date: end_date,
            }
          });
      
          const filteredData = applyFilters(response.data);
          setTransactionData(filteredData);
      
          // Calculate total income without currency conversion
          const income = filteredData.reduce((sum, item) => {
            if (item.transaction_type === 'Income') {
              return sum + parseFloat(item.amount);
            }
            return sum;
          }, 0);
      
          // Calculate total expenses without currency conversion
          const expense = filteredData.reduce((sum, item) => {
            if (item.transaction_type === 'Expense') {
              return sum + parseFloat(item.amount);
            }
            return sum;
          }, 0);
      
          // Update the state with the calculated values
          setTotalIncome(parseFloat(income));
          setTotalExpense(expense);
          setTotalTransactions(filteredData.length); // Set total number of transactions
      
          setDateRange(DateClickButton);
      
        } catch (error) {
          console.error('Error fetching data:', error.response ? error.response.data : error.message);
        } finally {
          setIsLoading(false);
        }
      };
      

    const applyFilters = (transactions) => {

        return transactions.filter(item =>
            // Amount filter
            (transactionFilter.amountFilterType === 'All' ||
                (transactionFilter.amountFilterType === 'Over' && parseFloat(item.amount) > parseFloat(transactionFilter.amount.min)) ||
                (transactionFilter.amountFilterType === 'Under' && parseFloat(item.amount) < parseFloat(transactionFilter.amount.max)) ||
                (transactionFilter.amountFilterType === 'Between' &&
                    parseFloat(item.amount) >= parseFloat(transactionFilter.amount.min) &&
                    parseFloat(item.amount) <= parseFloat(transactionFilter.amount.max)) ||
                (transactionFilter.amountFilterType === 'Exact' && parseFloat(item.amount) === parseFloat(transactionFilter.amount.exact))
            ) &&
            // Wallet filter
            (transactionFilter.walletFilterType === 'All' || item.wallets_name === transactionFilter.walletFilterType) &&
            // Transaction Type filter
            (transactionFilter.transactionType === 'All' || item.transaction_type === transactionFilter.transactionType) &&
            // Note filter
            (!transactionFilter.note || (item.note && item.note.toLowerCase().includes(transactionFilter.note.toLowerCase())))
        );
    };
    
    useEffect(() => {
          fetchTransactionData();
    }, [transactionFilter, state.dateRangeApply, state.reFresh]);

    const onRefresh = () => {
        fetchTransactionData();
    };

    const handleItemClick = (transaction) => {
        navigation.navigate('ViewTransaction', { data: transaction });
    };

    const renderItem = useCallback(({ item }) => {
        const note = item.note || '';
        const truncatedNote = note.length > 20 ? `${note.substring(0, 20)} ...` : note;

        const amountTextColor = item.transaction_type === 'Expense' ? '#b02305' : '#169709';

        const transactionDate = new Date(item.transaction_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let formattedDate;
        if (transactionDate.toDateString() === today.toDateString()) {
            formattedDate = 'Today';
        } else if (transactionDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
            formattedDate = 'Yesterday';
        } else {
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            formattedDate = transactionDate.toLocaleDateString('en-IN', options);
        }

        const formattedAmount = parseFloat(item.amount) % 1 === 0
            ? parseInt(item.amount).toString()
            : parseFloat(item.amount).toFixed(2);

        return (
            <TouchableRipple
                onPress={() => handleItemClick(item)}
                rippleColor="rgba(0, 0, 0, .32)"
                style={{paddingBottom:rh(1), backgroundColor: theme.primary, borderBottomWidth:0.2, borderColor:theme.border }}
                key={item.id}
                className="mb-0.5 py-1"
            >
                <View className="px-2" style={styles.itemContent}>
                    <View style={styles.itemLeft}>
                        <View style={styles.iconContainer}>
                        <Image source={{ uri: `${BASE_URL}${item.categories_icon}` }} style={styles.categoryIcon} />
                        <View style={styles.walletIconContainer}>
                            <Image source={{ uri: `${BASE_URL}${item.wallets_icon}` }} style={styles.walletIcon} />
                        </View>
                        </View>
                        <View className="pl-3">
                            <Text className="font-bold" style={{ color: theme.text }}>
                                {item.transaction_category_name}
                            </Text>
                            {truncatedNote && truncatedNote.trim() !== '' ? ( // Check if truncatedNote is not null or an empty string
                                <Text style={{ color: theme.subtext }}>{truncatedNote}</Text>
                            ) : null}  
                        </View>

                    </View>
                    <View>
                        <Text style={[styles.amount, { color: amountTextColor }]}>{item.currency_symbols} {formattedAmount}</Text>
                        <Text className="text-center" style={{ color: theme.subtext }}>{formattedDate}</Text>
                    </View>
                </View>
            </TouchableRipple>
        );
    }, [theme, handleItemClick]);
    

    const handleRemoveFilter = (filterType) => {
        if (filterType === 'transactionType') {
            dispatch({
                type: 'SET_TRANSACTION_TYPE_FILTER',
                payload:  'All',
              });
        } else if (filterType === 'wallet') {
            dispatch({
                type: 'SET_WALLET_FILTER',
                payload: {
                  walletFilterType: 'All',
                  wallet: null, // or an empty string or the default wallet object if you want
                },
              });              
        } else if (filterType === 'amount') {
            dispatch({
                type: 'SET_AMOUNT_FILTER',
                payload: {
                  amountFilterType: 'All',
                  amount: { min: null, max: null, exact: null },
                },
              });
        } else if (filterType === 'note') {
            dispatch({
                type: 'SET_NOTE_FILTER',
                payload:  null,
              });
        }
    };
    

    return (
        <View className="flex-1 px-3">
            {/* Filter Title show */}
            {(transactionFilter.walletFilterType !== 'All' || transactionFilter.transactionType !== 'All' || transactionFilter.amountFilterType !== 'All' || transactionFilter.note) && (
                <View className="p-1 px-3 mt-1 flex-row space-x-2 items-center" style={{ backgroundColor: theme.secondary }}>
                    <Text style={{ color: theme.text }}>Filters Applied:</Text>
                    <View className="flex-row space-x-1">
                        {/* Walets Filter */}
                        {transactionFilter.walletFilterType !== 'All' && (
                            <View className="p-2 px-2 flex-row space-x-2 items-center justify-center" style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                                <Text style={{ color: theme.text }}>{transactionFilter.walletFilterType}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFilter('wallet')}>
                                    <MaterialIcons color={theme.text} name="cancel" size={15} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {/* Category Filter */}
                        {transactionFilter.transactionType !== 'All' && (
                            <View className="p-2 px-2 flex-row space-x-2 items-center justify-center" style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                                <Text style={{ color: theme.text }}>{transactionFilter.transactionType}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFilter('transactionType')}>
                                    <MaterialIcons color={theme.text} name="cancel" size={15} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {/* Amount Filter */}
                        {transactionFilter.amountFilterType !== 'All' && (
                            <View className="p-2 px-2 flex-row space-x-2 items-center justify-center" style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                                <Text style={{ color: theme.text }}>{transactionFilter.amountFilterType}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFilter('amount')}>
                                    <MaterialIcons color={theme.text} name="cancel" size={15} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {/* Note Filter */}
                        {transactionFilter.note && (
                            <View className="p-2 px-2 flex-row space-x-2 items-center justify-center" style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                                <Text style={{ color: theme.text }}>{transactionFilter.note}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFilter('note')}>
                                    <MaterialIcons color={theme.text} name="cancel" size={15} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Total Income and Expense Amount Show */}
            <View className="p-3 mt-1 flex-row justify-between items-center" style={{ backgroundColor: theme.secondary }}>
                <View>
                    <View className="flex-row items-center">
                        <View className="space-y-1">
                            <Text style={{ color: theme.text}}>Date Range : {dateRange}</Text>
                            <Text style={{ color: theme.text}}>Transactions : {totalTransactions}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <View className="flex-row">
                        <Text style={{ color:  '#169709', fontSize: rf(2.4) }}>Income : </Text>
                        <Text style={{ color:  '#169709', fontSize: rf(2.4) }}>{totalIncome}</Text>
                    </View>
                    <View className="flex-row">
                        <Text style={{ color:  '#b02305', fontSize: rf(2.4) }}>Expense : </Text>
                        <Text style={{ color: '#b02305', fontSize: rf(2.4) }}>{totalExpense}</Text>
                    </View>
                </View>
            </View>

            {/* FlatList for transactions */}
            <FlatList
                data={isLoading ? Array(20).fill({}) : transactionData} // Show placeholders while loading
                renderItem={({ item, index }) => (
                    isLoading ? (
                        <View className="items-center p-1 flex-1" style={styles.itemContent}>
                            <View style={styles.itemLeft}>
                                <View style={styles.iconContainer}>
                                    <ShimmerPlaceholder shimmerColors={[theme.tertiary, theme.secondary, theme.tertiary]} style={{ height: 30, width: 30, borderRadius: 5 }} />
                                    <View style={[styles.walletIconContainer, {backgroundColor:'transparent'}]}>
                                        <ShimmerPlaceholder shimmerColors={[theme.tertiary, theme.secondary, theme.tertiary]} style={{width:20, height:20, borderRadius: 5 }} />
                                    </View>
                                </View>
                                <View className="pl-3 space-y-1">
                                    <ShimmerPlaceholder shimmerColors={[theme.tertiary, theme.secondary, theme.tertiary]} style={{ height: 10, width: '70%', backgroundColor: theme.tertiary, marginBottom: 3 }} />
                                    <ShimmerPlaceholder shimmerColors={[theme.tertiary, theme.secondary, theme.tertiary]} style={{ height: 8, width: '50%', backgroundColor: theme.tertiary }} />
                                </View>
                            </View>
                            <View className="space-y-2 justify-between">
                                <ShimmerPlaceholder className="justify-end" shimmerColors={[theme.tertiary, theme.secondary, theme.tertiary]} style={{ height: 10, width: '30%', backgroundColor: theme.tertiary }} />
                                <ShimmerPlaceholder shimmerColors={[theme.tertiary, theme.secondary, theme.tertiary]} style={{ height: 8, width: '40%', backgroundColor: theme.tertiary }} />
                            </View>
                        </View>
                    ) : (
                        renderItem({ item })
                    )
                )}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                className="mt-2 flex-1"
            />

        </View>
    );
};

// Styles
const styles = {
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletIcon: {
        width: rw(3),
        height: rh(1.5),
        borderRadius: 5,
    },
    categoryIcon: {
        width: rw(7.5),
        height: rw(7.5),
        borderRadius:5
    },
    walletIconContainer: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        borderRadius: 6,
        backgroundColor: 'white',
        padding: 2,
    },
    parentCategoryContainer: {
        marginBottom: rh(1),
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    parentCategoryName: {
        fontSize: rf(2.5),
        fontWeight: 'bold',
    },
    parentIcon: {
        width: rw(9.5),
        height: rh(4.5),
        marginBottom: rh(1),
        borderRadius: 5,
    },
    amount: {
        fontSize: rf(2.3),
        textAlign: 'right',
    },
};

export default TransactionHistoryTransactions;