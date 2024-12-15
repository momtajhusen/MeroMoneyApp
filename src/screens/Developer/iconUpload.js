import React, { useState, useRef } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert, Animated } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';

const IconUpload = () => {
  const { theme } = useTheme();

  const [iconName, setIconName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ iconName: '', image: '', iconCategory: '' });

  // Animated values for shaking
  const iconShake = useRef(new Animated.Value(0)).current;
  const iconNameShake = useRef(new Animated.Value(0)).current;
  const iconCategoryShake = useRef(new Animated.Value(0)).current;

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

  const emojisWithIcons = [
    { title: 'Wallet', icon: 'wallet-outline' },
    { title: 'Categories', icon: 'shape-outline' },
    { title: 'Other', icon: '' },
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

    
    if (!imageUri) {
      setErrors((prev) => ({ ...prev, image: 'Image is required.' }));
      shakeAnimation(iconShake);
      valid = false;
      return false;
    }

    if (!iconName) {
      setErrors((prev) => ({ ...prev, iconName: 'Icon name is required.' }));
      shakeAnimation(iconNameShake);
      valid = false;
      return false;
    }

    if (!selectedIcon) {
      setErrors((prev) => ({ ...prev, iconCategory: 'Icon category is required.' }));
      shakeAnimation(iconCategoryShake);
      valid = false;
      return false;
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

      // Make API request
      const response = await apiClient.post('/icons', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Icon uploaded successfully!');
        // Reset form
        setIconName('');
        setImageUri(null);
        setSelectedIcon(null);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 10, backgroundColor: theme.primary, flex: 1 }}>
      <View style={styles.row}>
        {/* Image Picker */}
        <Animated.View style={{ transform: [{ translateX: iconShake }] }}>
          <TouchableRipple onPress={pickImage}>
            <Image
              source={imageUri ? { uri: imageUri } : require('../../../assets/default-icon.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableRipple>
        </Animated.View>

        {/* Icon Name Input */}
        <Animated.View style={{ flex: 1, transform: [{ translateX: iconNameShake }] }}>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="Icon Name"
            placeholderTextColor={theme.text}
            value={iconName}
            onChangeText={setIconName}
          />
        </Animated.View>
      </View>

      {/* Icon Category Dropdown */}
      <Animated.View style={{ transform: [{ translateX: iconCategoryShake }] }}>
        <SelectDropdown
          data={emojisWithIcons}
          onSelect={(selectedItem) => {
            setSelectedIcon(selectedItem); // Save the full object
          }}
          defaultValue={selectedIcon}  // Now passing the full object
          renderButton={(selectedItem, isOpened) => (
            <View style={[styles.dropdownButton, { backgroundColor: theme.secondary }]}>
              {selectedItem && (
                <Icon name={selectedItem.icon} style={[styles.icon, { color: theme.text }]} />
              )}
              <Text style={[styles.buttonText, { color: theme.text }]}>
                {(selectedItem && selectedItem.title) || 'Select Icon Categories'}
              </Text>
              <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={[styles.arrow, { color: theme.text }]} />
            </View>
          )}
          renderItem={(item, index, isSelected) => (
            <View style={[styles.dropdownItem, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <Icon name={item.icon} style={[styles.icon, { color: isSelected ? theme.accent : theme.text }]} />
              <Text style={[styles.itemText, { color: isSelected ? theme.accent : theme.text }]}>
                {item.title}
              </Text>
            </View>
          )}
          dropdownStyle={[styles.dropdownMenu, { backgroundColor: theme.primary }]}
        />
      </Animated.View>

      {/* Save Button */}
      <SaveButton title="Save" onPress={handleSubmit} loading={loading} />
    </View>
  );
};

export default IconUpload;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 45,
    height: 45,
    marginRight: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    height: 55,
    paddingHorizontal: 10,
    fontSize: 18,
    borderRadius: 5,
    borderWidth: 1,
  },
  dropdownButton: {
    height: 50,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  arrow: {
    fontSize: 20,
    marginLeft: 'auto',
  },
  dropdownItem: {
    paddingVertical:12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 20,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  dropdownMenu: {
    width: '80%',
    borderRadius: 5,
  },
});
