//import liraries
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import apiClient from '../../../apiClient'; 
import { List } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../themes/ThemeContext';
import CustomAlert from '../../components/common/CustomAlert';

// create a component
const ParentIncemeCategory = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Base URL for your API or CDN
  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  const [category, setCategory] = useState([]);

  // State for CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const { state, dispatch } = useContext(AppContext);

  const fetchCategoryData = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategory(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlertMessage('Failed to fetch categories. Please try again.');
      setAlertType('info');
      setAlertVisible(true);
    }
  };

  const CategoryClick = (parentCategoryId, parentCategoryName) => {
    if (state.categoryId !== parentCategoryId) {
      dispatch({ type: 'SET_CATEGORY', payload: { parentCategoryId, parentCategoryName } });
      navigation.goBack();
    } else {
      setAlertMessage('Please choose a different parent category.');
      setAlertType('info');
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [navigation]);

  // Filter categories to show only Expense with parent_id null
  const filteredCategories = category.filter(cat => cat.type === "Income" && cat.parent_id === null);

  return (
    <View className="p-4 flex-1" style={{ backgroundColor: theme.primary }}>
      {filteredCategories.map((category) => (
        <TouchableOpacity 
          key={category.id}  
          className="bg-white my-1" 
          onPress={() => CategoryClick(category.id, category.name)}
        >
          <List.Item
            className="p-1"
            title={category.name}
            titleStyle={{ color: theme.text }}
            style={{ backgroundColor: theme.secondary, color: theme.text }}
            left={() => (
              <Image 
                source={{ uri: `${BASE_URL}${category.icon_path}` }} 
                style={{ width: 35, height: 35, borderRadius: 5 }} 
              />
            )}
          />
        </TouchableOpacity>
      ))}

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

//make this component available to the app
export default ParentIncemeCategory;
