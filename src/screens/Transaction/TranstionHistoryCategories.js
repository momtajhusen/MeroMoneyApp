import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Image,TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { AppContext } from '../../context/AppContext';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format, startOfMonth,endOfMonth} from 'date-fns';
import { rw, rh, rf } from '../../themes/responsive';


const BASE_URL = 'https://finance.scriptqube.com/storage/';

const TransactionHistoryCategories = () => {
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

    // Fetch transaction categories data
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

            const response = await apiClient.get('/transactions-category', {
                params: {
                    start_date: start_date,
                    end_date: end_date,
                }
            });

            const filteredData = applyFilters(response.data); // Apply filters on fetched data
            setTransactionData(filteredData);

            // Calculate total income and expenses
            const income = filteredData.reduce((sum, category) => {
                return sum + category.transactions.reduce((catSum, transaction) => {
                    return transaction.transaction_type === 'Income' ? catSum + parseFloat(transaction.amount) : catSum;
                }, 0);
            }, 0);

            const expense = filteredData.reduce((sum, category) => {
                return sum + category.transactions.reduce((catSum, transaction) => {
                    return transaction.transaction_type === 'Expense' ? catSum + parseFloat(transaction.amount) : catSum;
                }, 0);
            }, 0);

            setTotalIncome(income);
            setTotalExpense(expense);
            setDateRange(DateClickButton);

            // Calculate total transactions
            const totalTrans = filteredData.reduce((total, category) => total + category.total_count, 0);
            setTotalTransactions(totalTrans); 

 

        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);

        }
    };

    // Apply filters based on transactionFilter state
// Apply filters based on transactionFilter state
const applyFilters = (categories) => {
    return categories.map((category) => {
        const filteredTransactions = category.transactions.filter((transaction) =>
            // Amount filter
            (transactionFilter.amountFilterType === 'All' ||
                (transactionFilter.amountFilterType === 'Over' && parseFloat(transaction.amount) > parseFloat(transactionFilter.amount.min)) ||
                (transactionFilter.amountFilterType === 'Under' && parseFloat(transaction.amount) < parseFloat(transactionFilter.amount.max)) ||
                (transactionFilter.amountFilterType === 'Between' &&
                    parseFloat(transaction.amount) >= parseFloat(transactionFilter.amount.min) &&
                    parseFloat(transaction.amount) <= parseFloat(transactionFilter.amount.max)) ||
                (transactionFilter.amountFilterType === 'Exact' && parseFloat(transaction.amount) === parseFloat(transactionFilter.amount.exact))
            ) &&
            // Wallet filter
            (transactionFilter.walletFilterType === 'All' || transaction.wallets_name === transactionFilter.walletFilterType) &&
            // Transaction Type filter
            (transactionFilter.transactionType === 'All' || transaction.transaction_type === transactionFilter.transactionType) &&
            // Note filter
            (!transactionFilter.note || (transaction.note && transaction.note.toLowerCase().includes(transactionFilter.note.toLowerCase())))
        );

        // If no transactions match the filter, exclude the category
        if (filteredTransactions.length === 0) {
            return null;
        }

        // Return category with filtered transactions
        return {
            ...category,
            transactions: filteredTransactions,
            total_count: filteredTransactions.length,
            total_amount: filteredTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)
        };
    }).filter(category => category !== null); // Remove null entries where categories were filtered out
};


    useEffect(() => {
        fetchTransactionData();
    }, [transactionFilter, state.dateRangeApply, state.reFresh]);

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchTransactionData();
    };

    const handleItemClick = (transaction) => {
        navigation.navigate('ViewTransaction', { data: transaction });
    };

    const renderTransactionItem = useCallback(({ item }) => {
        const note = item.note ? item.note : '';
        const truncatedNote = note.length > 20 ? `${note.substring(0, 20)} ...` : note;
        const amountTextColor = item.transaction_type === 'Expense' ? '#b02305' : '#169709';
        
        const transactionDate = new Date(item.transaction_date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        const isToday = transactionDate.toDateString() === today.toDateString();
        const isYesterday = transactionDate.toDateString() === yesterday.toDateString();
        
        let formattedDate;
        if (isToday) {
            formattedDate = 'Today';
        } else if (isYesterday) {
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
                style={{ backgroundColor: theme.secondary }}
                key={item.id}
                className="mb-0.5 pb-1"
            >
                <View className="px-2" style={styles.itemContent}>
                    <View style={styles.itemLeft}>
                            <View>
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
    }, [theme]);
    

    const renderParentCategory = useCallback(({ item }) => {
        const formattedTotalAmount = parseFloat(item.total_amount) % 1 === 0
            ? parseInt(item.total_amount).toString()
            : parseFloat(item.total_amount).toFixed(2);
    
        return (
            <View className="p-2 pb-0" style={[styles.parentCategoryContainer, { backgroundColor: theme.secondary  }]} key={item.parent_category_name}>
                <View className="flex-row justify-between pb-1" style={{borderBottomWidth:1, borderColor:theme.border}}>
                    <View className="flex-row space-x-2">
                        <Image source={{ uri: `${BASE_URL}${item.parent_icon}` }} style={styles.parentIcon} />
                        <View>
                            <Text style={[styles.parentCategoryName, { color: theme.text }]}>{item.parent_category_name}</Text>
                            <Text style={[styles.parentCategoryName, { color: theme.text, fontSize: 12 }]}>
                                Transactions: {item.total_count}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.parentCategoryName, { color: theme.text }]}>{formattedTotalAmount}</Text>
                </View>
                <FlatList
                    data={item.transactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={(transaction) => transaction.id.toString()}
                />
            </View>
        );
    }, [theme, renderTransactionItem]);

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
                  wallet: null,
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
        <View className="px-3 flex-1">

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
                        <View>
                            <Text style={{ color: theme.text}}>Date Range : {dateRange}</Text>
                            <Text style={{ color: theme.text}}>Transactions : {totalTransactions}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <View className="flex-row">
                        <Text style={{ color:  '#169709', fontSize: 18 }}>Income : </Text>
                        <Text style={{ color:  '#169709', fontSize: 18 }}>{totalIncome}</Text>
                    </View>
                    <View className="flex-row">
                        <Text style={{ color:  '#b02305', fontSize: 18 }}>Expense : </Text>
                        <Text style={{ color: '#b02305', fontSize: 18 }}>{totalExpense}</Text>
                    </View>
                </View>
            </View>


            {transactionData.length === 0 && !isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: theme.subtext, fontSize: 16 }}>
                        No transactions available.
                    </Text>
                    <Text style={{ color: theme.subtext, fontSize: 16 }}>
                        {dateRange}
                    </Text>
                </View>
            ) : (
            <FlatList
                data={transactionData}
                renderItem={renderParentCategory}
                keyExtractor={(item) => item.parent_category_name}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
                className="mt-2"
            />
        )}



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
        width: 12,
        height: 12,
        borderRadius: 5,
    },
    categoryIcon: {
        width: 30,
        height: 30,
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
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    parentCategoryName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    parentIcon: {
        width: 35,
        height: 35,
        marginBottom: 5,
        borderRadius: 5,
    },
    amount: {
        fontSize: 18,
        textAlign: 'right',
    },
};

export default TransactionHistoryCategories