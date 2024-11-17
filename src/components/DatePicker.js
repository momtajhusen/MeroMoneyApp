// DatePicker.js
import React,{useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import  { useTheme } from '../themes/ThemeContext';


const DatePicker = ({ selectedDate, onPress }) => {

  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();


  return (
    <TouchableOpacity onPress={onPress}>
      <View className="space-x-4 py-4" style={[styles.dateContainer, {backgroundColor:theme.secondary}]}>
        <MaterialIcons color="black" name="calendar-month" size={22} style={{color:theme.text}} />
        <Text className="font-bold" style={{color:theme.text}}>{selectedDate.toDateString()}</Text>
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
