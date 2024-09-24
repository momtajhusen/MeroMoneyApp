import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../../apiClient';

const IconUpload = () => {
  const [iconName, setIconName] = useState('');
  const [imageUri, setImageUri] = useState('https://www.clipartmax.com/png/middle/209-2095114_%C2%A0-icon.png');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ iconName: '', image: '', iconCategory: '' });

  const emojisWithIcons = [
    { title: 'Wallet', icon: 'wallet-outline' },
    { title: 'Categories', icon: 'shape-outline' },
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
    setErrors({ iconName: '', image: '', iconCategory: '' });
  
    // Validate inputs
    let valid = true;
    if (!iconName) {
      setErrors((prev) => ({ ...prev, iconName: 'Icon name is required.' }));
      valid = false;
    }
    if (imageUri === 'https://www.clipartmax.com/png/middle/209-2095114_%C2%A0-icon.png') {
      setErrors((prev) => ({ ...prev, image: 'Image is required.' }));
      valid = false;
    }
    if (!selectedIcon) {
      setErrors((prev) => ({ ...prev, iconCategory: 'Icon category is required.' }));
      valid = false;
    }
  
    if (!valid) return;
  
    setLoading(true);


  
    try {
      const formData = new FormData();
      formData.append('name', iconName);
      formData.append('type', selectedIcon.title);
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'icon-image.jpeg',
      });

      // Make API request apiClient
      const response = await apiClient.post('/icons', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success
      if (response.status === 201) {
        Alert.alert('Success', 'Icon uploaded successfully!');
        // Reset form
        setIconName('');
        setImageUri('https://www.clipartmax.com/png/middle/209-2095114_%C2%A0-icon.png');
        setSelectedIcon(null);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
          if (error.response && error.response.status === 422) {
            // Extract the first error message from the response
            const errors = error.response.data.errors;
            let errorMessage = '';
        
            // Assuming you want to show the first error message for any field
            for (const [field, messages] of Object.entries(errors)) {
              errorMessage = messages[0]; // Get the first message for the field
              break; // Break after getting the first error message
            }
        
            // Display the error message in an alert
            Alert.alert('Validation Error', errorMessage);
          } else {
            // Handle other types of errors
            Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
          }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={{ padding: 10 }}>
      <View style={styles.card}>
        {/* Icon Name Input */}
        <View style={styles.row}>
          <TouchableRipple onPress={pickImage}>
            <Image 
              source={{ uri: imageUri }}
              style={styles.image} 
               resizeMode="contain"
            />
          </TouchableRipple>
          <TextInput
            style={styles.input}
            placeholder="Icon Name"
            value={iconName}
            onChangeText={(value) => setIconName(value)}
          />
        </View>
        {errors.iconName ? <Text style={styles.errorText}>{errors.iconName}</Text> : null}

        <SelectDropdown
          data={emojisWithIcons}
          onSelect={(selectedItem, index) => {
            setSelectedIcon(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                {selectedItem && (
                  <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                )}
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Select Icon Categories'}
                </Text>
                <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        {errors.iconCategory ? <Text style={styles.errorText}>{errors.iconCategory}</Text> : null}

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
        {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
      </View>
    </View>
  );
};

export default IconUpload;

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
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    fontSize: 18,
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
