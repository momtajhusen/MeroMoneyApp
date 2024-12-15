import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../themes/ThemeContext'; 
import { rw, rh, rf } from '../../../themes/responsive';

// create a component
const PasswordChangeSucess = ({ navigation }) => {

  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Text style={[styles.successText, { color: "green", fontSize: rf(4) }]}>
        PASSWORD {'\n'} UPDATED
      </Text>

      <View style={[styles.iconContainer, { borderColor: "green" }]}>
        <MaterialCommunityIcons 
          name="check" 
          size={rw(20)}  // Responsive icon size
          color={"green"} 
          style={styles.icon}
        />
      </View>

      <TouchableOpacity
        title="Go to Login" 
        onPress={() => navigation.navigate('Login')} 
        style={[styles.button, { backgroundColor: theme.secondary }]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: rw(5), // Responsive padding based on screen width
  },
  successText: {
    fontSize: rf(6), // Responsive font size based on screen width
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: rh(5), // Responsive margin based on screen height
  },
  iconContainer: {
    width: rw(30),  // 30% of screen width
    height: rw(30), // 30% of screen width
    borderRadius: rw(15), // Half the width to make it circular
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rh(5), // Margin relative to screen height
  },
  icon: {
    textAlign: 'center',
  },
  button: {
    paddingVertical: rh(2), // Vertical padding based on screen height
    paddingHorizontal: rw(10),  // Horizontal padding based on screen width
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default PasswordChangeSucess;
