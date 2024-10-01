import React,{useContext} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import  { useTheme } from '../themes/ThemeContext';


const SaveButton = ({ onPress, loading, disabled, title="save" }) => {

  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();


  return (
    <TouchableRipple
      className="my-5"
      onPress={!loading && !disabled ? onPress : null}
      rippleColor="rgba(0, 0, 0, .32)"
      style={[styles.saveButton, disabled && styles.disabledButton, {backgroundColor:theme.secondary}]}
      disabled={disabled}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.saveButtonText, {color:theme.text}]}>{title}</Text>
        )}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight:'bold'
  },
});

export default SaveButton;
