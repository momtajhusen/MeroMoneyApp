import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../themes/ThemeContext';
import FilterBottomSheet from '../../components/common/BottomSheetComponent';
import TransactionHistoryTransactions from './TranstionHistoryTransactions';
import TranstionHistoryCategories from './TranstionHistoryCategories';
import DateRangeModal from './DateRangeModal';
import { AppContext } from '../../context/AppContext';
import { rw, rh, rf } from '../../themes/responsive';
import { useNavigation, useRoute } from '@react-navigation/native';


const TransactionHistory = () => {
        const navigation = useNavigation();
    
    const { theme } = useTheme();
    const [isSheetVisible, setSheetVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('Transaction');
    const [isDateModalVisible, setDateModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isSearchInputVisible, setSearchInputVisible] = useState(false); // New state for search input visibility
    const inputRef = useRef(null); // Create a ref for the TextInput

    const { state, dispatch } = useContext(AppContext);

    // Function to get data from AsyncStorage
    const getStoredTab = async () => {
        try {
            const storedTab = await AsyncStorage.getItem('activeCategoryTab');
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

    // Effect to focus the input when it becomes visible
    useEffect(() => {
        if (isSearchInputVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchInputVisible]);

    const openSheet = () => setSheetVisible(true);
    const closeSheet = () => setSheetVisible(false);

    const openDateModal = () => setDateModalVisible(true);
    const closeDateModal = () => setDateModalVisible(false);

    // Function to handle tab change and store the selected tab in AsyncStorage
    const handleTabChange = async (tabName) => {
        try {
            setActiveTab(tabName);
            await AsyncStorage.setItem('activeCategoryTab', tabName);
        } catch (error) {
            console.error("Error saving tab in AsyncStorage: ", error);
        }
    };

    // Function to handle text change in the search input
    const handleSearchTextChange = (value) => {
        setSearchText(value);  // Update local state for search input
        dispatch({ type: 'SET_SEARCH_TRANSACTION', payload: value});
    };
    
    // Function to clear the search text
    const clearSearchText = () => {
        setSearchText('');
        setSearchInputVisible(false); // Hide search input when cleared
    };

    const toggleSearch = () => {
        dispatch({
            type: 'SEARCH_VISIBLE',
            payload: !state.isSearchVisible,
        });
    };

    const addTranstion = ()=>{
        navigation.navigate('AddTransaction');
        dispatch({ type: 'SET_WALLET', payload: { walletId: null, walletName: null, walletImage: null } });
        dispatch({ type: 'SET_CATEGORY', payload: { categoryId: null, categoryName: null, categoryImage: null } });
        dispatch({  type: 'TRANSCTION_DATA',  payload: { transactionId: null, transactionAmount: null, transactionNote: null, transactionDate: null } });
        dispatch({ type: 'SET_CATEGORY_SELECT_TYPE', payload: null });
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.primary }]}>
            {/* Button to open the bottom sheet */}
            <View style={[styles.tabContainer, { backgroundColor: theme.secondary }]}>
                <View style={styles.tabsWrapper}>
                    
                    <TouchableOpacity
                        onPress={() => handleTabChange('Transaction')}
                        style={[styles.tabButton, {
                            backgroundColor: activeTab === 'Transaction' ? theme.secondary : theme.primary,
                            borderColor: activeTab === 'Transaction' ? theme.border : theme.primary,
                        }]}
                    >
                        <Text style={[styles.tabText, { fontWeight: activeTab === 'Transaction' ? 'bold' : 'normal' }]}>Transaction</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleTabChange('Categories')}
                        style={[styles.tabButton, {
                            backgroundColor: activeTab === 'Categories' ? theme.secondary : theme.primary,
                            borderColor: activeTab === 'Categories' ? theme.border : theme.primary,
                        }]}
                    >
                        <Text style={[styles.tabText, { fontWeight: activeTab === 'Categories' ? 'bold' : 'normal' }]}>Categories</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconWrapper}>
                {activeTab === 'Transaction' ? 
                   <TouchableOpacity 
                        onPress={toggleSearch}
                        style={[styles.iconButton, { backgroundColor: theme.primary }]}
                    >
                        <MaterialIcons name={state.isSearchVisible ? 'close' : 'search'} size={24} color={theme.text} />
                    </TouchableOpacity>
                    : null}
                    <TouchableOpacity 
                        onPress={openDateModal} 
                        style={[styles.iconButton, { backgroundColor: theme.primary }]}
                    >
                        <MaterialIcons color={theme.text} name="date-range" size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={openSheet} 
                        style={[styles.iconButton, { backgroundColor: theme.primary }]}
                    >
                        <MaterialIcons color={theme.text} name="filter-list" size={22} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Input  */}
            {isSearchInputVisible && (
                <View style={[styles.searchInputContainer, { backgroundColor: theme.secondary }]}>
                    <TextInput
                        ref={inputRef} // Attach ref to TextInput
                        style={{ color: theme.text }}
                        value={searchText}
                        placeholder='Search Transaction'
                        placeholderTextColor={theme.text}
                        onChangeText={handleSearchTextChange} 
                    />
                    {searchText ? (
                        <TouchableOpacity onPress={clearSearchText} style={[styles.clearButton, { backgroundColor: theme.primary }]}>
                            <MaterialIcons color={theme.text} name="close" size={20} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            )}

            {/* Render the selected tab content */}
            {activeTab === 'Transaction' ? <TransactionHistoryTransactions /> : <TranstionHistoryCategories />}

            {/* Custom bottom sheet for filtering */}
            <FilterBottomSheet visible={isSheetVisible} onClose={closeSheet} />

            {/* Date Selection Modal */}
            <DateRangeModal isVisible={isDateModalVisible} onClose={closeDateModal} />

             
            <View style={{position:"absolute", bottom:rh(4), right:rw(10), width:rw(10)}}>
                <TouchableOpacity onPress={addTranstion} style={{width:rw(13),  height:rw(13), justifyContent:"center", alignItems:"center", borderWidth:1, borderColor:theme.border, borderRadius:10}}>
                        <MaterialIcons
                          color={theme.text}
                          name="add"
                          size={rf(5)}
                        />
                </TouchableOpacity>
            </View>

        </View>
    );
};

// Responsive Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: rw(2),
        marginTop:rh(1),
        marginHorizontal: rw(3),
        borderRadius: rw(1),
    },
    tabsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: rw(2),
    },
    tabButton: {
        paddingVertical: rh(1),
        paddingHorizontal: rw(4),
        borderRadius: rw(1),
        borderWidth: 1,
    },
    tabText: {
        fontSize: rf(1.5),
        color: '#fff',
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: rw(2),
    },
    iconButton: {
        padding: rw(2),
        borderRadius: rw(1),
    },
    searchInputContainer: {
        marginTop: rh(1),
        padding: rw(2),
        borderRadius: rw(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    clearButton: {
        padding: rw(1),
        borderRadius: rw(1),
    },
});

export default TransactionHistory;
