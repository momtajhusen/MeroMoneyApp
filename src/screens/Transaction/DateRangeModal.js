// DateModal.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { rw, rh, rf } from '../../themes/responsive';


import {
    format,
    startOfToday,
    endOfToday,
    startOfYesterday,
    endOfYesterday,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subMonths,
    subWeeks,
    startOfYear,
    endOfYear,
    subYears
} from 'date-fns';

const DateRangeModal = ({ isVisible, onClose }) => {

    const { state, dispatch } = useContext(AppContext);

    const { theme } = useTheme();
    const [selectedButton, setSelectedButton] = useState('This Month');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
            handleButtonClick('Custom Date');
        }
    };
    
    const handleEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
            handleButtonClick('Custom Date');
        }
    };

    useEffect(() => {
        const fetchDateClickButton = async () => {
            const DateClickButton = await AsyncStorage.getItem('DateClickButton');
            setSelectedButton(DateClickButton);
        };
        fetchDateClickButton();
    }, [isVisible]);
    

    const handleButtonClick = async (buttonLabel) => {
        setSelectedButton(buttonLabel);

        switch (buttonLabel) {
            case 'Today':
                setStartDate(startOfToday());
                setEndDate(endOfToday());
                break;
            case 'Yesterday':
                 setStartDate(startOfYesterday());
                 setEndDate(endOfYesterday());
                break;
            case 'This Week':
                 setStartDate(startOfWeek(new Date()));
                 setEndDate(endOfWeek(new Date()));
                break;
            case 'Last Week':
                 setStartDate(startOfWeek(subWeeks(new Date(), 1)));
                 setEndDate(endOfWeek(subWeeks(new Date(), 1)));
                break;
            case 'This Month':
                 setStartDate(startOfMonth(new Date()));
                 setEndDate(endOfMonth(new Date()));
                break;
            case 'Last Month':
                 setStartDate(startOfMonth(subMonths(new Date(), 1)));
                 setEndDate(endOfMonth(subMonths(new Date(), 1)));
                break;
            case 'This Year':
                 setStartDate(startOfYear(new Date()));
                 setEndDate(endOfYear(new Date()));
                break;
            case 'Last Year':
                setStartDate(startOfYear(subYears(new Date(), 1)));
                setEndDate(endOfYear(subYears(new Date(), 1)));
                break;
        }


        // onClose();
    };

    const closeDateModal = () => {
        onClose();
    };

    const handleApply = async () => {

        await AsyncStorage.setItem('DateClickButton', selectedButton);


        const transactionDates = {
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        };

        await AsyncStorage.setItem('transaction_dates', JSON.stringify(transactionDates));

        dispatch({ type: 'SET_DATE_RANGE', payload:  selectedButton});
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeDateModal}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.secondary }]}>
                    <Text style={{ color: theme.text, fontSize: 18, marginBottom: 10 }}>Select Date Range</Text>
                    <View  className="py-2 p-3" style={{ width: '100%', height: '86%', borderColor: theme.border, borderWidth: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                        
                        {/* Day Rows */}
                        <View>
                            <Text className="font-bold" style={{ fontSize: 20, color: theme.text }}>DAY</Text>
                            <View className="flex-row space-x-3 mt-2" style={{ flexDirection: 'row', marginTop: 2 }}>
                                <TouchableOpacity
                                    className="p-2 px-3"
                                    style={{
                                        borderColor: selectedButton === 'Today' ? theme.accent : theme.border,
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleButtonClick('Today')}
                                >
                                    <Text style={{ color: selectedButton === 'Today' ? theme.accent : theme.text }}>
                                        Today
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-2 px-3"
                                    style={{
                                        borderColor: selectedButton === 'Yesterday' ? theme.accent : theme.border,
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleButtonClick('Yesterday')}
                                >
                                    <Text style={{ color: selectedButton === 'Yesterday' ? theme.accent : theme.text }}>
                                        Yesterday
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
    
                        {/* Week Rows */}
                        <View className="mt-3">
                            <Text className="font-bold" style={{ fontSize: 20, color: theme.text }}>WEEK</Text>
                            <View className="flex-row space-x-3 mt-2" style={{ flexDirection: 'row', marginTop: 2 }}>
                                <TouchableOpacity
                                    className="p-2 px-3"
                                    style={{
                                        borderColor: selectedButton === 'This Week' ? theme.accent : theme.border,
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleButtonClick('This Week')}
                                >
                                    <Text style={{ color: selectedButton === 'This Week' ? theme.accent : theme.text }}>
                                        This Week
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-2 px-3"
                                    style={{
                                        borderColor: selectedButton === 'Last Week' ? theme.accent : theme.border,
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleButtonClick('Last Week')}
                                >
                                    <Text style={{ color: selectedButton === 'Last Week' ? theme.accent : theme.text }}>
                                        Last Week
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
    
                        {/* Month Rows */}
                        <View className="mt-3">
                            <Text className="font-bold" style={{ fontSize: 20, color: theme.text }}>MONTH</Text>
                            <View className="flex-row space-x-3 mt-2" style={{ flexDirection: 'row', marginTop: 2 }}>
                                <TouchableOpacity
                                    className="p-2 px-3"
                                    style={{
                                        borderColor: selectedButton === 'This Month' ? theme.accent : theme.border,
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleButtonClick('This Month')}
                                >
                                    <Text style={{ color: selectedButton === 'This Month' ? theme.accent : theme.text }}>
                                        This Month
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-2 px-3"
                                    style={{
                                        borderColor: selectedButton === 'Last Month' ? theme.accent : theme.border,
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleButtonClick('Last Month')}
                                >
                                    <Text style={{ color: selectedButton === 'Last Month' ? theme.accent : theme.text }}>
                                        Last Month
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
    
                        {/* Year Rows */}
                        <View className="mt-3">
                            <Text className="font-bold" style={{ fontSize: 20, color: theme.text }}>YEAR</Text>
                            <View className="flex-row space-x-3 mt-2" style={{ flexDirection: 'row', marginTop: 2 }}>
                                <TouchableOpacity
                                    className="p-2 px-3"
                                    style={{
                                        borderColor: selectedButton === 'This Year' ? theme.accent : theme.border,
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleButtonClick('This Year')}
                                >
                                    <Text style={{ color: selectedButton === 'This Year' ? theme.accent : theme.text }}>
                                        This Year
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-2 px-3"
                                    style={{
                                        borderColor: selectedButton === 'Last Year' ? theme.accent : theme.border,
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleButtonClick('Last Year')}
                                >
                                    <Text style={{ color: selectedButton === 'Last Year' ? theme.accent : theme.text }}>
                                        Last Year
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Dustom Between Date Rows */}
                        <View className="mt-3">
    <Text className="font-bold" style={{ fontSize: 20, color: theme.text }}>CUSTOM DATE</Text>
    <View className="flex-row space-x-3 mt-2" style={{ flexDirection: 'row', marginTop: 2 }}>
        <TouchableOpacity
            className="p-2 px-3"
            style={{
                borderColor: selectedButton === 'Custom Date' ? theme.accent : theme.border,
                borderWidth: 0.5,
                borderRadius: 5,
            }}
            onPress={() => setShowStartDatePicker(true)}
        >
            <Text style={{ color: selectedButton === 'Custom Date' ? theme.accent : theme.text }}>
                {startDate.toDateString()}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            className="p-2 px-3"
            style={{
                borderColor: selectedButton === 'Custom Date' ? theme.accent : theme.border,
                borderWidth: 0.5,
                borderRadius: 5,
            }}
            onPress={() => setShowEndDatePicker(true)}
        >
            <Text style={{ color: selectedButton === 'Custom Date' ? theme.accent : theme.text }}>
                {endDate.toDateString()}
            </Text>
        </TouchableOpacity>
    </View>
    
    {/* Show date pickers when required */}
    {showStartDatePicker && (
        <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
        />
    )}
    {showEndDatePicker && (
        <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
        />
    )}
</View>
                        
                    </View>
    
                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity className="p-2" onPress={closeDateModal} style={{ borderColor: theme.border, borderWidth: 1, flex: 1, marginRight: 10 }}>
                            <Text style={{ textAlign: 'center', color: theme.text }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2" onPress={handleApply} style={{ borderColor: theme.border, borderWidth: 1, flex: 1 }}>
                            <Text style={{ textAlign: 'center', color: theme.text }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '70%',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 10,
    },
});

export default DateRangeModal;