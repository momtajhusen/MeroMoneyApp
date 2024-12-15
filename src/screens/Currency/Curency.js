// Import libraries
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import  { useTheme } from '../../themes/ThemeContext';

// Create a component
const Currency = () => {
  const navigation = useNavigation();
  const { dispatch } = useContext(AppContext);

  const { theme } = useTheme();

  // Base URL for your API or CDN
  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  const [currencyData, setCurrencyData] = useState([]);

  // Function to fetch currency data
  const fetchCurrencyData = async () => {
    try {
      const response = await apiClient.get('/currencies');
      setCurrencyData(response.data.data); // Adjust based on API response structure
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  // Function to handle currency click
  const handleCurrencyClick = (currencyId, currencyCode, currencyImage) => {
    dispatch({ type: 'SET_CURRENCY_ID', payload: currencyId });
    dispatch({ type: 'SET_CURRENCY_CODE', payload: currencyCode });
    navigation.goBack();
  };

  return (
    <View className="p-4 flex-1" style={{backgroundColor:theme.primary}}>
      {Array.isArray(currencyData) && currencyData.length > 0 ? (
        currencyData.map((currency) => (
          <TouchableRipple
            onPress={() => handleCurrencyClick(currency.id, currency.currency_code, BASE_URL + currency.flag)}
            rippleColor="rgba(0, 0, 0, .32)"
            style={{ backgroundColor: "#ddd" }}
            className="mb-1"
            key={currency.id} // Add a unique key prop
          >
            <View className="flex-row p-4 items-center justify-between border-b border-black-100" style={{backgroundColor:theme.secondary}}>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={{ uri: `${BASE_URL}${currency.flag}` }}
                  style={styles.image}
                />
                <View>
                  <Text style={{color:theme.text}}>{currency.currency_name}</Text>
                  <Text style={{color:theme.text}}>{currency.currency_code}</Text>
                </View>
              </View>
              {/* <MaterialIcons className="mr-2 my-4" color="black" name="arrow-forward-ios" size={15} /> */}
            </View>
          </TouchableRipple>
        ))
      ) : (
        <Text>No currency data available.</Text>
      )}
    </View>
  );
};

// Make this component available to the app
export default Currency;

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    marginRight: 10, // Adds space between the image and text
  },
});
