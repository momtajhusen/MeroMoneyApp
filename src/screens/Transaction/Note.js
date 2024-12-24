// Import libraries
import React, { useRef, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import  { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';
import { rw, rh, rf } from '../../themes/responsive';

// Create a component
const Note = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();


  const [isLoading, setIsLoading] = useState(false);



  // Create a ref for the TextInput
  const textInputRef = useRef(null);

  // Focus the TextInput on component mount
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  // Handle save function
  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <View className="p-4 flex-1" style={{backgroundColor:theme.primary}}>
      <View className="p-4" style={{borderRadius:10, borderWidth:1, borderColor:theme.border}}>
        <TextInput
          ref={textInputRef} // Attach the ref to the TextInput
          style={[styles.textArea, {color:theme.text, height:rh(45)}]}
          placeholder="Write your note here..."
          placeholderTextColor={theme.text} 
          value={state.transactionNote} // Display the note from state
          multiline={true}
          numberOfLines={4}
          autoFocus={true}
          onChangeText={(value) => dispatch({ type: 'TRANSCTION_NOTE', payload: value })}
        />
      </View>

      <SaveButton 
        onPress={handleSave} 
        loading={isLoading}
      />

    </View>
  );
};

// Make this component available to the app
export default Note;

const styles = StyleSheet.create({
  textArea: {
    paddingHorizontal: 10,
    fontSize: 18,
    textAlignVertical: 'top',
    padding: 10,
  },
  button: {
    backgroundColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
});
