// Import libraries
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';
import { rw, rh, rf } from '../../themes/responsive';

const Hello = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Image
        source={require('../../../assets/authImages/hello-account.png')}
        style={styles.image}
      />
      <Text style={[styles.title, { color: theme.text }]}>Hello User !</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Welcome To MeroMoney, where {"\n"} you manage your finance
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={[styles.button, { backgroundColor: theme.accent }]}
        accessibilityLabel="Login to MeroMoney"
      >
        <Text style={[styles.buttonText, {color: theme.text }]}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
        style={[
          styles.button,
          {
            backgroundColor: theme.primary,
            borderWidth: 1,
            borderColor: theme.accent,
          },
        ]}
        accessibilityLabel="Sign up for MeroMoney"
      >
        <Text style={[styles.buttonText, { color: theme.accent }]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // corrected to valid property
    paddingTop: rh(8),
  },
  image: {
    width: rw(90),
    height: rh(35),
  },
  title: {
    fontSize: rf(4),
    fontWeight: 'bold',
    marginVertical: rh(2),
  },
  subtitle: {
    textAlign: 'center',
    fontSize: rf(2),
    marginTop: rh(2),
  },
  button: {
    width: rw(80),
    paddingVertical: rh(2),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(2),
  },
  buttonText: {
    fontSize: rf(2.5),
    fontWeight: 'bold',
  },
});

export default Hello;
