// TransactionHistory.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../themes/ThemeContext';
import CustomBottomSheet from '../../components/common/BottomSheetComponent';
import TransactionHistoryTransactions from './TranstionHistoryTransactions';
import TranstionHistoryCategories from './TranstionHistoryCategories';

const TransactionHistory = () => {
    const { theme } = useTheme();
    const [isSheetVisible, setSheetVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('Transaction');

    // Function to get data from AsyncStorage
    const getStoredTab = async () => {
        try {
            const storedTab = await AsyncStorage.getItem('activeTab');
            if (storedTab) {
                setActiveTab(storedTab);
            }
        } catch (error) {
            console.error("Error reading value from AsyncStorage: ", error);
        }
    };

    // Retrieve the stored tab on initial load
    useEffect(() => {
        getStoredTab();
    }, []);

    const openSheet = () => setSheetVisible(true);
    const closeSheet = () => setSheetVisible(false);

    // Function to handle tab change and store the selected tab in AsyncStorage
    const handleTabChange = async (tabName) => {
        try {
            setActiveTab(tabName);
            await AsyncStorage.setItem('activeTab', tabName);
        } catch (error) {
            console.error("Error saving tab in AsyncStorage: ", error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.primary }]}>
            {/* Button to open the bottom sheet */}
            <View className="flex-row justify-between p-2 px-3 mx-3" style={{ backgroundColor: theme.secondary, borderRadius: 10 }}>
                <View className="flex-row items-center space-x-2">
                    <TouchableOpacity
                        onPress={() => handleTabChange('Transaction')}
                        className="p-2 px-4"
                        style={{
                            backgroundColor: activeTab === 'Transaction' ? theme.secondary : theme.primary,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: activeTab === 'Transaction' ? theme.border : theme.primary,
                        }}
                    >
                        <Text style={{ color: theme.text, fontWeight: activeTab === 'Transaction' ? 'bold' : 'normal' }}>Transaction</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleTabChange('Categories')}
                        className="p-2 px-4"
                        style={{
                            backgroundColor: activeTab === 'Categories' ? theme.secondary : theme.primary,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: activeTab === 'Categories' ? theme.border : theme.primary,
                        }}
                    >
                        <Text style={{ color: theme.text, fontWeight: activeTab === 'Categories' ? 'bold' : 'normal' }}>Categories</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row space-x-4 items-center">
                    <TouchableOpacity className="p-2" style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                        <MaterialIcons color={theme.text} name="search" size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2" onPress={openSheet} style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
                        <MaterialIcons color={theme.text} name="filter-list" size={22} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Render the selected tab content */}
            {activeTab === 'Transaction' ? <TransactionHistoryTransactions /> : <TranstionHistoryCategories />}

            {/* Custom bottom sheet */}
            <CustomBottomSheet visible={isSheetVisible} onClose={closeSheet} />
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default TransactionHistory;
