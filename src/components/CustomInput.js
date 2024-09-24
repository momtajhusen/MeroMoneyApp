// CustomInput.js
import React, {useContext} from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { AppContext } from '../context/AppContext';
import { lightTheme, darkTheme } from '../themes'; 

const CustomInput = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => {

  const { state, dispatch } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; 

  return (
    <View className="mb-0.5" style={[styles.inputContainer, {backgroundColor:themeColor.secondary}]}>
      <TextInput
        style={[styles.input, {color:themeColor.text}]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={themeColor.text} 
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
