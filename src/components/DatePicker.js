// DatePicker.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../themes/ThemeContext';

const DatePicker = ({ selectedDate, onPress }) => {
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  // Helper function to determine if the selected date is Today, Yesterday, or Tomorrow
  const getRelativeDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0); // Normalize to midnight

    const diffInDays = (selected - today) / (1000 * 60 * 60 * 24);

    if (diffInDays === 0) return 'Today';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays === 1) return 'Tomorrow';

    return selected.toDateString(); // Fallback to standard date format
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className="space-x-4 py-4"
        style={[styles.dateContainer, { backgroundColor: theme.secondary }]}
      >
        <MaterialIcons
          color="black"
          name="calendar-month"
          size={22}
          style={{ color: theme.text }}
        />
        <Text className="font-bold" style={{ color: theme.text }}>
          {getRelativeDate(selectedDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});

export default DatePicker;
