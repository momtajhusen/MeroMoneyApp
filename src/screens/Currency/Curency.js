// Import libraries
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';

// Create a component
const Currency = () => {
  const navigation = useNavigation();
  const { dispatch } = useContext(AppContext);

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
    <View style={styles.card}>
      {Array.isArray(currencyData) && currencyData.length > 0 ? (
        currencyData.map((currency) => (
          <TouchableRipple
            onPress={() => handleCurrencyClick(currency.id, currency.currency_code, BASE_URL + currency.flag)}
            rippleColor="rgba(0, 0, 0, .32)"
            style={{ backgroundColor: "#ddd" }}
            className="mb-1"
            key={currency.id} // Add a unique key prop
          >
            <View className="flex-row p-4 items-center justify-between border-b border-black-100">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={{ uri: `${BASE_URL}${currency.flag}` }}
                  style={styles.image}
                />
                <View>
                  <Text>{currency.currency_name}</Text>
                  <Text>{currency.currency_code}</Text>
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
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10, // Adds space between the image and text
  },
});
