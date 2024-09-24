import React,{useContext} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { lightTheme, darkTheme } from '../themes'; 

const SaveButton = ({ onPress, loading, disabled }) => {

  const { state, dispatch } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; 

  return (
    <TouchableRipple
      className="my-5"
      onPress={!loading && !disabled ? onPress : null}
      rippleColor="rgba(0, 0, 0, .32)"
      style={[styles.saveButton, disabled && styles.disabledButton, {backgroundColor:themeColor.secondary}]}
      disabled={disabled}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.saveButtonText, {color:themeColor.text}]}>Save</Text>
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
