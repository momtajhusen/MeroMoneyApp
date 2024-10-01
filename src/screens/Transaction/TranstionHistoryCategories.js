import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Image } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { AppContext } from '../../context/AppContext';

const BASE_URL = 'https://finance.scriptqube.com/storage/';

const TransactionHistoryCategories = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    const [transactionData, setTransactionData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { state } = useContext(AppContext);
    const { transactionFilter } = state;

    // Fetch transaction categories data
    const fetchTransactionData = async () => {
        try {
            const response = await apiClient.get('/transactions-category');
            const filteredData = applyFilters(response.data); // Apply filters on fetched data
            setTransactionData(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Apply filters based on transactionFilter state
    const applyFilters = (categories) => {
        return categories.map(category => ({
            ...category,
            transactions: category.transactions.filter(transaction =>
                // Apply Amount Filter
                (transactionFilter.amountFilterType === 'All' ||
                    (transactionFilter.amountFilterType === 'Over' && parseFloat(transaction.amount) > parseFloat(transactionFilter.amount.min)) ||
                    (transactionFilter.amountFilterType === 'Under' && parseFloat(transaction.amount) < parseFloat(transactionFilter.amount.max)) ||
                    (transactionFilter.amountFilterType === 'Between' &&
                        parseFloat(transaction.amount) >= parseFloat(transactionFilter.amount.min) &&
                        parseFloat(transaction.amount) <= parseFloat(transactionFilter.amount.max)) ||
                    (transactionFilter.amountFilterType === 'Exact' && parseFloat(transaction.amount) === parseFloat(transactionFilter.amount.exact))
                ) &&
                // Apply Category Filter
                (transactionFilter.categoryFilter === 'All' || transaction.transaction_type === transactionFilter.categoryFilter) &&
                // Apply Note Filter
                (!transactionFilter.note || (transaction.note && transaction.note.toLowerCase().includes(transactionFilter.note.toLowerCase())))
            )
        })).filter(category => category.transactions.length > 0); // Remove categories with no transactions after filtering
    };

    useEffect(() => {
        fetchTransactionData();
    }, [transactionFilter]);

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
        const date = new Date(item.transaction_date);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-IN', options);

        return (
            <TouchableRipple
                onPress={() => handleItemClick(item)}
                rippleColor="rgba(0, 0, 0, .32)"
                style={{ backgroundColor: theme.secondary }}
                key={item.id}
                className="mb-0.5 py-1"
            >
                <View style={styles.itemContent}>
                    <View style={styles.itemLeft}>
                        <View style={styles.iconContainer}>
                            <Image source={{ uri: `${BASE_URL}${item.wallets_icon}` }} style={styles.walletIcon} />
                        </View>
                        <View className="pl-3 space-y-2">
                            <Text className="font-bold" style={{ color: theme.text }}>{formattedDate}</Text>
                            {truncatedNote && <Text style={{ color: theme.subtext }}>{truncatedNote}</Text>}
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.amount, { color: amountTextColor }]}>{item.amount}</Text>
                    </View>
                </View>
            </TouchableRipple>
        );
    }, [theme]);

    const renderParentCategory = useCallback(({ item }) => (
        <View style={[styles.parentCategoryContainer, { backgroundColor: theme.secondary }]}>
            <View className="flex-row justify-between">
                <View className="flex-row space-x-2">
                    <Image source={{ uri: `${BASE_URL}${item.parent_icon}` }} style={styles.parentIcon} />
                    <View>
                        <Text style={[styles.parentCategoryName, { color: theme.text }]}>{item.parent_category_name}</Text>
                        <Text style={[styles.parentCategoryName, { color: theme.text, fontSize: 12 }]}>
                            Transactions: {item.total_count}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.parentCategoryName, { color: theme.text }]}>{item.total_amount}</Text>
            </View>
            <FlatList
                data={item.transactions}
                renderItem={renderTransactionItem}
                keyExtractor={(transaction) => transaction.id.toString()}
            />
        </View>
    ), [theme, renderTransactionItem]);

    return (
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
            className="mx-3 mt-2"
        />
    );
};

// Styles
const styles = {
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
    walletIcon: {
        width: 25,
        height: 25,
        borderRadius: 5,
    },
    parentCategoryContainer: {
        marginBottom: 10,
        padding: 10,
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
