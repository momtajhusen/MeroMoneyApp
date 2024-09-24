import React, { useEffect, useContext } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../apiClient'; 
import { AppContext } from '../context/AppContext'; 
import * as Animatable from 'react-native-animatable';

const Splash = () => {
  const navigation = useNavigation();
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

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
      } catch (error) {
        console.error('Error checking auth token:', error.message);
        navigation.replace('Login');
      }
    };

    setTimeout(()=>{
       checkAuthToken();
    },3000);
  }, [navigation, dispatch]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash.png')}
        style={{ height: '100%' }}
        resizeMode="contain"
      />
      <Animatable.Image
        animation="zoomIn"
        source={require('../../assets/logo.jpg')}
        style={{
          width: 250,
          height: 250,
          position: 'absolute',
          top: '35%',
          borderRadius: 30,
          elevation: 20,
          backgroundColor: '#ffffff50',
        }}
        resizeMode="contain"
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Splash;
