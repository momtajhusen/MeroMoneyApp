import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Alert, RefreshControl } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../apiClient';
import { TouchableRipple } from 'react-native-paper';
import  { useTheme } from '../../themes/ThemeContext';

const TransactionHistory = () => {
    const navigation = useNavigation();
    const { state } = useContext(AppContext);
    const { theme } = useTheme();
    const BASE_URL = 'https://finance.scriptqube.com/storage/';

    const [transactionData, setTransactionData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchTransactionData = async () => {
        try {
            const response = await apiClient.get('/transactions');
            setTransactionData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTransactionData();
    }, []);

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchTransactionData();
    };

    const handleItemClick = (transaction) => {
        navigation.navigate('ViewTransaction', { data: transaction });
    };

    const renderItem = ({ item }) => {
        const note = item.note ? item.note : '';
        const truncatedNote = note.length > 20 ? note.substring(0, 20) + ' ...' : note;
        const amountTextColor = item.transaction_type === 'Expense' ? '#b02305' : item.transaction_type === 'Income' ? '#169709' : 'black';
        const date = new Date(item.transaction_date);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-IN', options);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;

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
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.primary }]}>
            {transactionData.length > 0 ? (
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
            ) : (
                <View style={styles.centeredView}>
                    <Text style={{ color: theme.text }}>No transaction data available.</Text>
                </View>
            )}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
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
});

export default TransactionHistory;
