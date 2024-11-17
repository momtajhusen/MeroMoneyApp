// CustomInput.js
import React, { useContext } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../themes/ThemeContext';

const CustomInput = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => {
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const AmountTextColor =
    state.categorySelectType === 'Expense'
      ? '#b02305'
      : state.categorySelectType === 'Income'
      ? '#169709'
      : theme.text;

  return (
    <View className="mb-0.5" style={[styles.inputContainer]}>
      <TextInput
        style={[
          styles.input,
          {
            color: AmountTextColor,
            borderWidth: 1,
            borderColor: theme.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.subtext} // Normal weight placeholder
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 55,
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: 'bold', // Bold for input text
    borderRadius:5
  },
});

export default CustomInput;
