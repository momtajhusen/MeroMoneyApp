// Import libraries
import React, { useRef, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { lightTheme, darkTheme } from '../../themes'; 
import SaveButton from '../../components/SaveButton';


// Create a component
const Note = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; 

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
    <View className="p-4 flex-1" style={{backgroundColor:themeColor.primary}}>
      <View className="p-4" style={{backgroundColor:themeColor.secondary, borderRadius:10}}>
        <TextInput
          ref={textInputRef} // Attach the ref to the TextInput
          style={[styles.textArea, {color:themeColor.text}]}
          placeholder="Write your note here..."
          placeholderTextColor={themeColor.text} 
          value={state.transactionNote} // Display the note from state
          multiline={true}
          numberOfLines={4}
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
    height: 400,
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
