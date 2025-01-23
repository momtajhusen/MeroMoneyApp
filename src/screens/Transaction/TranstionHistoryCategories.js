import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { AppContext } from '../../context/AppContext';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startOfMonth, endOfMonth } from 'date-fns';

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
    const [expandedCategories, setExpandedCategories] = useState({});

    const { state, dispatch } = useContext(AppContext);
    const { transactionFilter } = state;

    // Fetch transaction categories data
    const fetchTransactionData = async () => {
        try {
            setIsLoading(true);
            const storedDates = await AsyncStorage.getItem('transaction_dates');
            const parsedDates = storedDates ? JSON.parse(storedDates) : {};
            const start_date = parsedDates.start_date || startOfMonth(new Date());
            const end_date = parsedDates.end_date || endOfMonth(new Date());
            const DateClickButton = await AsyncStorage.getItem('DateClickButton') || 'This Month';

            const response = await apiClient.get('/transactions-category', {
                params: { start_date, end_date },
            });

            const filteredData = applyFilters(response.data);
            setTransactionData(filteredData);

            const income = filteredData.reduce((sum, category) => (
                sum + category.transactions.reduce((catSum, transaction) => (
                    transaction.transaction_type === 'Income' ? catSum + parseFloat(transaction.amount) : catSum
                ), 0)
            ), 0);

            const expense = filteredData.reduce((sum, category) => (
                sum + category.transactions.reduce((catSum, transaction) => (
                    transaction.transaction_type === 'Expense' ? catSum + parseFloat(transaction.amount) : catSum
                ), 0)
            ), 0);

            setTotalIncome(income);
            setTotalExpense(expense);
            setDateRange(DateClickButton);

            const totalTrans = filteredData.reduce((total, category) => total + category.total_count, 0);
            setTotalTransactions(totalTrans);
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    const applyFilters = (categories) => {
        return categories.map((category) => {
            const filteredTransactions = category.transactions.filter((transaction) =>
                (transactionFilter.amountFilterType === 'All' ||
                    (transactionFilter.amountFilterType === 'Over' && parseFloat(transaction.amount) > parseFloat(transactionFilter.amount.min)) ||
                    (transactionFilter.amountFilterType === 'Under' && parseFloat(transaction.amount) < parseFloat(transactionFilter.amount.max)) ||
                    (transactionFilter.amountFilterType === 'Between' &&
                        parseFloat(transaction.amount) >= parseFloat(transactionFilter.amount.min) &&
                        parseFloat(transaction.amount) <= parseFloat(transactionFilter.amount.max)) ||
                    (transactionFilter.amountFilterType === 'Exact' && parseFloat(transaction.amount) === parseFloat(transactionFilter.amount.exact))) &&
                (transactionFilter.walletFilterType === 'All' || transaction.wallets_name === transactionFilter.walletFilterType) &&
                (transactionFilter.transactionType === 'All' || transaction.transaction_type === transactionFilter.transactionType) &&
                (!transactionFilter.note || (transaction.note && transaction.note.toLowerCase().includes(transactionFilter.note.toLowerCase())))
            );

            if (filteredTransactions.length === 0) {
                return null;
            }

            return {
                ...category,
                transactions: filteredTransactions,
                total_count: filteredTransactions.length,
                total_amount: filteredTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0),
            };
        }).filter(category => category !== null);
    };

    
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

    const toggleCategory = (categoryName) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };

    const renderTransactionItem = useCallback(({ item }) => {
        const note = item.note ? item.note : '';
        const truncatedNote = note.length > 20 ? `${note.substring(0, 20)} ...` : note;
        const amountTextColor = item.transaction_type === 'Expense' ? '#b02305' : '#169709';

        const transactionDate = new Date(item.transaction_date);
        const formattedDate = transactionDate.toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

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
                            {truncatedNote && (
                                <Text style={{ color: theme.subtext }}>{truncatedNote}</Text>
                            )}
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.amount, { color: amountTextColor }]}>{item.currency_symbols} {item.amount}</Text>
                        <Text className="text-center" style={{ color: theme.subtext }}>{formattedDate}</Text>
                    </View>
                </View>
            </TouchableRipple>
        );
    }, [theme]);

    const renderParentCategory = useCallback(({ item }) => {
        console.log(item);
        const isExpanded = expandedCategories[item.parent_category_name] || false;
        const formattedTotalAmount = parseFloat(item.total_amount) % 1 === 0
            ? parseInt(item.total_amount).toString()
            : parseFloat(item.total_amount).toFixed(2);

            const amountTextColor = item.transactions[0].transaction_type === 'Expense' ? '#b02305' : '#169709';

        return (
            <View className="p-2 pb-0" style={[styles.parentCategoryContainer, { backgroundColor: theme.secondary }]} key={item.parent_category_name}>
                <TouchableOpacity className="flex-row justify-between pb-1" style={{ borderBottomWidth: 1, borderColor: theme.border }}>
                    <TouchableOpacity onPress={() => toggleCategory(item.parent_category_name)} style={{gap:5, flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image source={{ uri: `${BASE_URL}${item.parent_icon}` }} style={styles.parentIcon} />
                        <View>
                            <Text style={[styles.parentCategoryName, { color: theme.text }]}>{item.parent_category_name}</Text>
                            <Text style={[styles.parentCategoryName, { color: theme.text, fontSize: 12 }]}>
                                Transactions: {item.total_count}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.parentCategoryName, { color: amountTextColor }]}>{formattedTotalAmount}</Text>
                    {/* <MaterialIcons
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={24}
                        color={theme.text}
                    /> */}
                </TouchableOpacity>
                {isExpanded && (
                    <FlatList
                        data={item.transactions}
                        renderItem={renderTransactionItem}
                        keyExtractor={(transaction) => transaction.id.toString()}
                    />
                )}
            </View>
        );
    }, [expandedCategories, theme, renderTransactionItem]);

    return (
        <View className="px-3 flex-1">
            {/* Filter Applied */}
            {(transactionFilter.walletFilterType !== 'All' || transactionFilter.transactionType !== 'All' || transactionFilter.amountFilterType !== 'All' || transactionFilter.note) && (
                <View className="p-1 px-3 mt-1 flex-row space-x-2 items-center" style={{ backgroundColor: theme.secondary }}>
                    <Text style={{ color: theme.text }}>Filters Applied:</Text>
                    <View className="flex-row space-x-1">
                        {transactionFilter.walletFilterType !== 'All' && (
                            <View className="p-2 px-2 flex-row space-x-2 items-center justify-center" style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                                <Text style={{ color: theme.text }}>{transactionFilter.walletFilterType}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFilter('wallet')}>
                                    <MaterialIcons color={theme.text} name="cancel" size={15} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {transactionFilter.transactionType !== 'All' && (
                            <View className="p-2 px-2 flex-row space-x-2 items-center justify-center" style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                                <Text style={{ color: theme.text }}>{transactionFilter.transactionType}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFilter('transactionType')}>
                                    <MaterialIcons color={theme.text} name="cancel" size={15} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {transactionFilter.amountFilterType !== 'All' && (
                            <View className="p-2 px-2 flex-row space-x-2 items-center justify-center" style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                                <Text style={{ color: theme.text }}>{transactionFilter.amountFilterType}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFilter('amount')}>
                                    <MaterialIcons color={theme.text} name="cancel" size={15} />
                                </TouchableOpacity>
                            </View>
                        )}
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

            {/* Date Range and Totals */}
            <View className="p-3 mt-1 flex-row justify-between items-center" style={{ backgroundColor: theme.secondary }}>
                <View>
                    <Text style={{ color: theme.text }}>Date Range: {dateRange}</Text>
                    <Text style={{ color: theme.text }}>Transactions: {totalTransactions}</Text>
                </View>
                <View>
                    <Text style={{ color: '#169709', fontSize: 18 }}>Income: {totalIncome}</Text>
                    <Text style={{ color: '#b02305', fontSize: 18 }}>Expense: {totalExpense}</Text>
                </View>
            </View>

            {/* Transaction Categories */}
            {transactionData.length === 0 && !isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: theme.subtext, fontSize: 16 }}>No transactions available.</Text>
                    <Text style={{ color: theme.subtext, fontSize: 16 }}>{dateRange}</Text>
                </View>
            ) : (
                <FlatList
                    data={transactionData}
                    renderItem={renderParentCategory}
                    keyExtractor={(item) => item.parent_category_name}
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                />
            )}
        </View>
    );
};

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
        borderRadius: 5,
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
        marginTop: 5,
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

export default TransactionHistoryCategories;
