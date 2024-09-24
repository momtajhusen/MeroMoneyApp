import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../../apiClient';

const CurrencyUpload = () => {
  const [imageUri, setImageUri] = useState('https://static.vecteezy.com/system/resources/previews/005/544/744/original/flag-icon-design-free-vector.jpg');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ currencyName: '', currencyCode: '', image: '', currency: '' });

  const currencies = [
    { currency_code: 'NPR', currency_name: 'Nepalese Rupee' },
    { currency_code: 'INR', currency_name: 'Indian Rupee' },
    { currency_code: 'QAR', currency_name: 'Qatari Rial' },
    { currency_code: 'SAR', currency_name: 'Saudi Riyal' },
    { currency_code: 'EUR', currency_name: 'Euro' },
    { currency_code: 'USD', currency_name: 'US Dollar' }
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setErrors({ currencyName: '', currencyCode: '', image: '', currency: '' });

    // Validate inputs
    let valid = true;
    if (imageUri === 'https://static.vecteezy.com/system/resources/previews/005/544/744/original/flag-icon-design-free-vector.jpg') {
      setErrors(prev => ({ ...prev, image: 'Flag is required.' }));
      valid = false;
    }
    if (!selectedCurrency) {
      setErrors(prev => ({ ...prev, currency: 'Currency is required.' }));
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('currency_code', selectedCurrency.currency_code);
      formData.append('currency_name', selectedCurrency.currency_name);
      formData.append('flag', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'flag-image.jpeg',
      });
      
    //   console.log(formData);

    //   return false ;

      const response = await apiClient.post('/currencies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      if (response.status === 201) {
        Alert.alert('Success', 'Currency uploaded successfully!');
        setImageUri('https://static.vecteezy.com/system/resources/previews/005/544/744/original/flag-icon-design-free-vector.jpg');
        setSelectedCurrency(null);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        let errorMessage = '';
        for (const [field, messages] of Object.entries(errors)) {
          errorMessage = messages[0];
          break;
        }
        Alert.alert('Validation Error', errorMessage);
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <View style={styles.card}>
        {/* Flag Image Upload */}
        <View style={styles.row}>
          <TouchableRipple onPress={pickImage}>
            <Image 
              source={{ uri: imageUri }}
              style={styles.image} 
              resizeMode="contain"
            />
          </TouchableRipple>
          {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
        </View>

        {/* Currency Dropdown */}
        <SelectDropdown
          data={currencies}
          onSelect={(selectedItem) => {
            setSelectedCurrency(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => (
            <View style={styles.dropdownButtonStyle}>
              {selectedItem && (
                <Icon name="currency-usd" style={styles.dropdownButtonIconStyle} />
              )}
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.currency_name) || 'Select Currency'}
              </Text>
              <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
            </View>
          )}
          renderItem={(item, index, isSelected) => (
            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
              {/* <Icon name="currency-usd" style={styles.dropdownItemIconStyle} /> */}
              <Text style={styles.dropdownItemTxtStyle}>{item.currency_name}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        {errors.currency ? <Text style={styles.errorText}>{errors.currency}</Text> : null}

        {/* Submit Button */}
        <TouchableRipple
          onPress={handleSubmit}
          rippleColor="rgba(0, 0, 0, .32)"
          style={styles.saveButton}
        >
          <View>
            <Text style={styles.saveButtonText}>
              {loading ? 'Submitting...' : 'Save'}
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
};

export default CurrencyUpload;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  dropdownButtonStyle: {
    height: 50,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 20,
    padding: 10,
  },
  saveButtonText: {
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
