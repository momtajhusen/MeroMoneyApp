import React, { useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import  { useTheme } from '../../themes/ThemeContext';



// Create a component
const ExpenseCategory = () => {

  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();


  // Base URL for your API or CDN
  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  const [categories, setCategory] = useState([]);

  const fetchCategoryData = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategory(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

    // Function to handle item presses
    const categoryPress = (categoryId, categoryName, categoryImage) => {
      // Dispatch both categoryId and categoryName in a single action
      dispatch({ type: 'SET_CATEGORY', payload: { categoryId, categoryName, categoryImage}});

      // If categoryBackNavigation exists, navigate to the respective screen
      if (state.categoryBackNavigation != null) {
         navigation.navigate(state.categoryBackNavigation);
         dispatch({ type: 'SET_CATEGORY_NAVIGATION', payload: null });
      }
    };



  // Render subcategories based on the parent category
  const renderSubcategories = ({ item: parentCategory }) => {
    const subcategories = categories.filter(category => category.parent_id === parentCategory.id);

    return (
      <View>
        {subcategories.map(subcategory => (
          <TouchableOpacity 
            key={subcategory.id}
            onPress={() => categoryPress(subcategory.id, subcategory.name, BASE_URL+subcategory.icon_path )}
            // style={styles.itemStyle}
            className="p-2 ml-4 flex-row"
            style={{backgroundColor:theme.secondary}}

          >
            <Image 
              source={{ uri: BASE_URL + subcategory.icon_path }}
              style={styles.iconStyle} 
            />
            <Text style={{color:theme.text}}>{subcategory.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render parent categories
  const renderCategories = ({ item: parentCategory }) => (
      
      <View className="mb-2" >
      <TouchableOpacity 
            onPress={() => categoryPress(parentCategory.id, parentCategory.name, BASE_URL+parentCategory.icon_path)}
        className="p-2 flex-row"
        style={{backgroundColor:theme.secondary}}
      >
        <Image 
          source={{ uri: BASE_URL + parentCategory.icon_path }}
          style={styles.iconStyle} 
        />
        <Text style={{color:theme.text}}>{parentCategory.name}</Text>
      </TouchableOpacity>
      {renderSubcategories({ item: parentCategory })}
    </View>
  );

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCategoryData();
    }, [])
  );

  // Separate parent categories from subcategories
  const parentCategories = categories.filter(category => category.parent_id === null && category.type === "Expense" );

  return (
    <View className="p-4 flex-1" style={{backgroundColor:theme.primary}}>
      {/* Button to navigate to 'NewCategory' screen */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('NewCategory', { categoryType: 'Expense' })}
        style={{backgroundColor:theme.secondary, borderWidth:1, borderColor:theme.border}}
        className="p-3 mb-3"
      >
        <Text className="text-center" style={{color:theme.text}}>Add New Category</Text>
      </TouchableOpacity>

      {/* FlatList Section */}
      <FlatList
        data={parentCategories}
        renderItem={renderCategories}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text className="text-center" style={{color:theme.text}}>No categories available</Text>}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
 
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  accordionStyle: {
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemStyle: {
    backgroundColor: '#fff',
    paddingLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  }
});

export default ExpenseCategory;
