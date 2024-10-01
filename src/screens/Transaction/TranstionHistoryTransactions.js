import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Image } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { AppContext } from '../../context/AppContext';

const BASE_URL = 'https://finance.scriptqube.com/storage/';

const TransactionHistoryTransactions = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    const [transactionData, setTransactionData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { state } = useContext(AppContext);
    const { transactionFilter } = state;

    // Fetch transactions data
    const fetchTransactionData = async () => {
        try {
            const response = await apiClient.get('/transactions');
            const filteredData = applyFilters(response.data);
            setTransactionData(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Apply filters based on transactionFilter state
    const applyFilters = (transactions) => {
        return transactions.filter(item =>
            // Apply Amount Filter
            (transactionFilter.amountFilterType === 'All' ||
                (transactionFilter.amountFilterType === 'Over' && parseFloat(item.amount) > parseFloat(transactionFilter.amount.min)) ||
                (transactionFilter.amountFilterType === 'Under' && parseFloat(item.amount) < parseFloat(transactionFilter.amount.max)) ||
                (transactionFilter.amountFilterType === 'Between' &&
                    parseFloat(item.amount) >= parseFloat(transactionFilter.amount.min) &&
                    parseFloat(item.amount) <= parseFloat(transactionFilter.amount.max)) ||
                (transactionFilter.amountFilterType === 'Exact' && parseFloat(item.amount) === parseFloat(transactionFilter.amount.exact))
            ) &&
            // Apply Category Filter
            (transactionFilter.categoryFilter === 'All' || item.transaction_type === transactionFilter.categoryFilter) &&
            // Apply Note Filter
            (!transactionFilter.note || (item.note && item.note.toLowerCase().includes(transactionFilter.note.toLowerCase())))
        );
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

    const renderItem = useCallback(({ item }) => {
        const note = item.note ? item.note : '';
        const truncatedNote = note.length > 20 ? `${note.substring(0, 20)} ...` : note;
        const amountTextColor = item.transaction_type === 'Expense' ? '#b02305' : item.transaction_type === 'Income' ? '#169709' : 'black';
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
                            <Image source={{ uri: `${BASE_URL}${item.categories_icon}` }} style={styles.categoryIcon} />
                            <View style={styles.walletIconContainer}>
                                <Image source={{ uri: `${BASE_URL}${item.wallets_icon}` }} style={styles.walletIcon} />
                            </View>
                        </View>
                        <View className="pl-3 space-y-2">
                            <Text className="font-bold" style={{ color: theme.text }}>{item.transaction_category_name}</Text>
                            <Text style={{ color: theme.subtext }}>{truncatedNote}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.amount, { color: amountTextColor }]}>{item.amount}</Text>
                        <Text style={{ color: theme.subtext }}>{formattedDate}</Text>
                    </View>
                </View>
            </TouchableRipple>
        );
    }, [theme, handleItemClick]);

    return (
        <FlatList
            data={transactionData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
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
        position: 'relative',
        marginRight: 8,
    },
    categoryIcon: {
        width: 35,
        height: 35,
    },
    walletIconContainer: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        borderRadius: 6,
        backgroundColor: 'white',
        padding: 2,
    },
    walletIcon: {
        width: 12,
        height: 12,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
    },
};

export default TransactionHistoryTransactions;
