import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../apiClient'; 
import { AppContext } from '../context/AppContext'; 
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../themes/ThemeContext';
import { rw, rh, rf } from '../themes/responsive';
import { useFocusEffect } from "@react-navigation/native";


const Splash = () => {
  const navigation = useNavigation();
  const { dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  useFocusEffect(() => {
    StatusBar.setTranslucent(true); 
    StatusBar.setBackgroundColor('transparent'); 
    StatusBar.setBarStyle('dark-content');  
  });

  useEffect(() => {
    const checkIntroAndAuthToken = async () => {
      try {
        const hasSeenIntro = await AsyncStorage.getItem('hasSeenIntro');
        if (hasSeenIntro === 'true') {
          const token = await AsyncStorage.getItem('authToken');
          console.log('token');
          console.log(token);
          console.log('token');
          if (token) {
            const response = await apiClient.get('/verify-token', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
              dispatch({
                type: 'SET_USER',
                payload: {
                  userId: response.data.user.id,
                  userRole: response.data.user.role,
                  userEmail: response.data.user.email,
                  userName: response.data.user.name,
                },
              });
              navigation.replace('CashUp');
            } else {
              navigation.replace('Login');
            }
          } else {
            navigation.replace('Login');
          }
        } else {
          navigation.replace('IntroScreen');
        }
      } catch (error) {
        console.error('Error checking auth token:', error.message);
        navigation.replace('Login');
      }
    };

    setTimeout(() => {
      checkIntroAndAuthToken();
    }, 3000);
  }, [navigation, dispatch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View>
        <Animatable.Image
          animation="zoomIn"
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* <Text style={{color:theme.text, textAlign:"center", fontSize:rf(3), letterSpacing: 2}}>Saver</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: rw(30),
    height: rw(30),  
  },
});

export default Splash;
