import React, { useContext, useEffect, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../themes/ThemeContext';

const CustomInput = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => {
  const { state } = useContext(AppContext);
  const { theme } = useTheme();
  const [AmountTextColor, setAmountTextColor] = useState(theme.text);

  // Update color based on categorySelectType
  useEffect(() => {
    console.log(state.categorySelectType);
    if (state.categorySelectType === 'Expense') {
      setAmountTextColor('#b02305'); // Red for Expense
    } else if (state.categorySelectType === 'Income') {
      setAmountTextColor('#169709'); // Green for Income
    } else {
      setAmountTextColor(theme.text); // Default theme color
    }
  }, [state.categorySelectType]);

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
        placeholderTextColor={theme.subtext}
        value={value}
        autoFocus={true}
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
    fontWeight: 'bold',
    borderRadius: 5,
  },
});

export default CustomInput;
