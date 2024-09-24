// DatePicker.js
import React,{useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { lightTheme, darkTheme } from '../themes'; 

const DatePicker = ({ selectedDate, onPress }) => {

  const { state, dispatch } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; 

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="space-x-4 py-4" style={[styles.dateContainer, {backgroundColor:themeColor.secondary}]}>
        <MaterialIcons color="black" name="calendar-month" size={22} style={{color:themeColor.text}} />
        <Text className="font-bold" style={{color:themeColor.text}}>{selectedDate.toDateString()}</Text>
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
