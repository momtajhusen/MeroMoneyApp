import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert, Animated } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../../apiClient';
import { useTheme } from '../../themes/ThemeContext';
import SaveButton from '../../components/SaveButton';
import { useNavigation, useRoute } from '@react-navigation/native';


const IconUpdate = ({ route }) => {
  const { iconId, iconType, iconImage, iconName } = route.params || {};
  const { theme } = useTheme();

  const navigation = useNavigation();

  const [updatedIconName, setUpdatedIconName] = useState(iconName || '');
  const [updatedImageUri, setUpdatedImageUri] = useState(iconImage || null);
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

  // Define emojis with icons
  const emojisWithIcons = [
    { title: 'Wallet', icon: 'wallet-outline' },
    { title: 'Categories', icon: 'shape-outline' },
    { title: 'Other', icon: '' },
  ];

  // Set the selected icon based on route parameter (iconType)
  useEffect(() => {
    if (iconType) {
      const selected = emojisWithIcons.find(icon => icon.title === iconType);
      setSelectedIcon(selected);
    }
  }, [iconType]);

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
      setUpdatedImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setErrors({ iconName: '', image: '', iconCategory: '' });

    // Validate inputs
    let valid = true;

    if (!updatedImageUri) {
      shakeAnimation(iconShake);
      valid = false;
      return false;
    }

    if (!updatedIconName) {
      shakeAnimation(iconNameShake);
      valid = false;
      return false;
    }

    if (!selectedIcon) {
      shakeAnimation(iconCategoryShake);
      valid = false;
      return false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('icon_id', iconId);
      formData.append('name', updatedIconName);
      formData.append('type', selectedIcon.title); // You can use `selectedIcon.title` directly
      formData.append('image', {
        uri: updatedImageUri,
        type: 'image/jpeg',
        name: 'icon-image.jpeg',
      });

      // Make API request to update icon
      const response = await apiClient.post('/icons-update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success
      if (response.status === 200) {
        Alert.alert('Success', 'Icon updated successfully!');
        // Reset form
        setUpdatedIconName('');
        setUpdatedImageUri(null);
        setSelectedIcon(null);
        navigation.goBack(); 
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.log(error.response.data.error);
      alert(error.response.data.error);
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
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4" style={{ padding: 10, backgroundColor: theme.primary }}>
      <View style={styles.row}>
        {/* Image Picker */}
        <Animated.View style={{ transform: [{ translateX: iconShake }] }}>
          <TouchableRipple onPress={pickImage}>
            <Image
              source={updatedImageUri ? { uri: updatedImageUri } : { uri: iconImage }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableRipple>
        </Animated.View>

        {/* Icon Name Input */}
        <Animated.View className="flex-1" style={{ transform: [{ translateX: iconNameShake }] }}>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="Icon Name"
            placeholderTextColor={theme.text}
            value={updatedIconName}
            onChangeText={setUpdatedIconName}
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
      <SaveButton title="Update" onPress={handleSubmit} loading={loading} />
    </View>
  );
};

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
    height: 50,
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

export default IconUpdate;
