// CustomInput.js
import React, {useContext} from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { AppContext } from '../context/AppContext';
import  { useTheme } from '../themes/ThemeContext';


const CustomInput = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => {

  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();


  return (
    <View className="mb-0.5" style={[styles.inputContainer, {backgroundColor:theme.secondary}]}>
      <TextInput
        style={[styles.input, {color:theme.text}]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={theme.text} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight:'bold'
  },
});

export default CustomInput;
