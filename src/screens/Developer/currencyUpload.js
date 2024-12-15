import React, { useState, useRef } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert,Animated } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../../apiClient';
import  { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';
import CustomAlert from '../../components/common/CustomAlert';


const CurrencyUpload = () => {
  const [imageUri, setImageUri] = useState('https://static.vecteezy.com/system/resources/previews/005/544/744/original/flag-icon-design-free-vector.jpg');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ currencyName: '', currencyCode: '', image: '', currency: '' });

  const { theme } = useTheme();

    // Animated values for shaking
    const iconShake = useRef(new Animated.Value(0)).current;
    const currencySelect = useRef(new Animated.Value(0)).current;
  
    // Shake animation function
    const shakeAnimation = (animatedValue) => {
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: -5, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 5, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    };

    // State for alert
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');


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
      shakeAnimation(iconShake);
      valid = false;
      return false;
    }
    if (!selectedCurrency) {
      shakeAnimation(currencySelect);
      valid = false;
      return false;
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
        // Handle success response
        setAlertMessage('Currency uploaded successfully!');
        setAlertType('success');
        setAlertVisible(true);
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
    <View className="flex-1 px-5" style={{ padding: 10, backgroundColor:theme.primary}}>
 
        {/* Flag Image Upload */}
 
        <View style={styles.row}>
          <TouchableRipple onPress={pickImage}>
            <Animated.Image 
              source={{ uri: imageUri }}
              style={[styles.image, { transform: [{ translateX: iconShake }] }]} // Fix applied here
              resizeMode="contain"
            />
          </TouchableRipple>
        </View>

        {/* Currency Dropdown */}
        <SelectDropdown
          data={currencies}
          onSelect={(selectedItem) => {
            setSelectedCurrency(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => (
            <Animated.View 
              style={[
                styles.dropdownButtonStyle, 
                { backgroundColor: theme.secondary, transform: [{ translateX: currencySelect }] }
              ]}
            >
              {selectedItem && (
                <Text style={{color:theme.text}}>({selectedItem.currency_code}) </Text>
              )}
              <Text style={[styles.dropdownButtonTxtStyle, {color:theme.text}]}>
                {(selectedItem && selectedItem.currency_name) || 'Select Currency'}
              </Text>
              <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={[styles.dropdownButtonArrowStyle, {color:theme.text}]} />
            </Animated.View>
          )}
          renderItem={(item, index, isSelected) => (
            <View style={{ ...styles.dropdownItemStyle, backgroundColor:theme.secondary, ...(isSelected && { backgroundColor:theme.primary }) }}>
              <Text style={[styles.dropdownItemTxtStyle, {color:theme.text}]}>{item.currency_name}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />

        {/* Submit Button */}
        <SaveButton title="Save" onPress={handleSubmit} loading={loading} />

      {/* CustomAlert for success/error messages */}
      <CustomAlert
        visible={alertVisible}
        title={alertType === 'success' ? 'Success' : 'Error'}
        message={alertMessage}
        confirmText="OK"
        onOk={() => setAlertVisible(false)}
        theme={theme}
        type={alertType}
      />
 
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
    borderRadius:5,
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
    fontSize: 20,
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
