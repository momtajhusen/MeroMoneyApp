import React, { useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Image, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';
import CustomAlert from '../../components/common/CustomAlert';

const ExpenseCategory = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const BASE_URL = 'https://finance.scriptqube.com/storage/';
  const [categories, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // State to control CustomAlert visibility
  const [alertMessage, setAlertMessage] = useState(''); // State to store alert message
  const [alertType, setAlertType] = useState(''); // State to store alert type


  const fetchCategoryData = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategory(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const categoryPress = (parentCategoryId, categoryId, parentCategoryName, categoryName, categoryImage, iconId, userRole) => {
    // Dispatch both categoryId and categoryName in a single action
    dispatch({ type: 'SET_CATEGORY', payload: { categoryId, categoryName, categoryImage } });
    dispatch({ type: 'SET_CATEGORY_SELECT_TYPE', payload: 'Expense' });

    // If categoryBackNavigation exists, navigate to the respective screen
    if (state.categoryBackNavigation != null) {
      navigation.navigate(state.categoryBackNavigation);
      dispatch({ type: 'SET_CATEGORY_NAVIGATION', payload: null });
    } else {
      // Show options modal when no back navigation is set
      setSelectedCategory({parentCategoryId, categoryId, parentCategoryName, categoryName, categoryImage, iconId, userRole});
      setOptionsModalVisible(true);
    }
  };

  const handleUpdate = () => {
    // Check if parentCategoryId and categoryId are the same
    const isSame = selectedCategory.parentCategoryId === selectedCategory.categoryId;
  
    dispatch({
      type: 'SET_CATEGORY',
      payload: {
        parentCategoryId: isSame ? null : selectedCategory.parentCategoryId,
        parentCategoryName: isSame ? null : selectedCategory.parentCategoryName,
        categoryId: selectedCategory.categoryId,
        categoryName: selectedCategory.categoryName,
        categoryImage: `${selectedCategory.categoryImage}`,
      },
    });
  
    dispatch({ type: 'SET_ICON_ID', payload: selectedCategory.iconId });
    dispatch({ type: 'SET_ICON_IMAGE', payload: selectedCategory.categoryImage });

  
    setOptionsModalVisible(false);
    navigation.navigate('UpdateCategory', { categoryType: 'Expense' });
  };
  

  const handleDeleteCategory = (categoryId) => {
    setModalVisible(true); // Show confirmation alert instead of deleting immediately
  };

  const confirmDeleteCategory = async () => {
    setModalVisible(false); 
    try {
      const response = await apiClient.delete(`/categories/${selectedCategory.categoryId}`);
      if (response.status === 200 || response.status === 204) {

        setAlertMessage('Category deleted successfully.');
        setAlertType('success'); // Set the alert type
        setAlertVisible(true);
      } else {
        setAlertMessage('Failed to delete the category.');
        setAlertType('error'); // Set the alert type
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Error deleting data:', error.response ? error.response.data : error.message);
      setAlertMessage(error.response?.data?.error || 'An error occurred while deleting the category.');
      setAlertType('error'); // Set the alert type
      setAlertVisible(true);
    } finally {
      setOptionsModalVisible(false);
      fetchCategoryData();
    }
  };
  

  const renderSubcategories = ({ item: parentCategory }) => {
    const subcategories = categories.filter(category => category.parent_id === parentCategory.id);


    return (
      <View>
        {subcategories.map(subcategory => (
          <TouchableOpacity 
            key={subcategory.id}
            onPress={() => categoryPress(parentCategory.id, subcategory.id, parentCategory.name, subcategory.name, BASE_URL + subcategory.icon_path, subcategory.icon_id, subcategory.user_role)}
            className="p-2 ml-4 flex-row"
            style={{ backgroundColor: theme.secondary }}
          >
            <Image 
              source={{ uri: BASE_URL + subcategory.icon_path }}
              style={styles.iconStyle} 
            />
            <Text style={{ color: theme.text }}>{subcategory.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategories = ({ item: parentCategory }) => (
    <View className="mb-2">
      <TouchableOpacity 
        onPress={() => categoryPress(parentCategory.id, parentCategory.id, parentCategory.name, parentCategory.name, BASE_URL + parentCategory.icon_path, parentCategory.icon_id, parentCategory.user_role)}
        className="p-2 flex-row"
        style={{ backgroundColor: theme.secondary }}
      >
        <Image 
          source={{ uri: BASE_URL + parentCategory.icon_path }}
          style={styles.iconStyle} 
        />
        <Text style={{ color: theme.text }}>{parentCategory.name}</Text>
      </TouchableOpacity>
      {renderSubcategories({ item: parentCategory })}
    </View>
  );

  useFocusEffect(
    useCallback(() => {
      fetchCategoryData();
    }, [])
  );

  const parentCategories = categories.filter(category => category.parent_id === null && category.type === "Expense");

  return (
    <View className="p-4 flex-1" style={{ backgroundColor: theme.primary }}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('NewCategory', { categoryType: 'Expense' })}
        style={{ backgroundColor: theme.secondary, borderWidth: 1, borderColor: theme.border }}
        className="p-3 mb-3"
      >
        <Text className="text-center" style={{ color: theme.text }}>Add New Category</Text>
      </TouchableOpacity>

      <FlatList
        data={parentCategories}
        renderItem={renderCategories}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text className="text-center" style={{ color: theme.text }}>No categories available</Text>}
      />

      {/* Modal for options */}
      <Modal
  transparent={true}
  visible={isOptionsModalVisible}
  animationType="slide"
  onRequestClose={() => setOptionsModalVisible(false)}
>
  <View style={styles.modalBackground}>
    <View style={[styles.modalContainer, { backgroundColor: theme.secondary }]}>
      <View className="flex-row">
        <Image 
          source={{ uri: selectedCategory?.categoryImage }} // Optional chaining to avoid errors
          style={styles.iconStyle} 
        />
        <Text className="font-bold mt-1" style={{ color: theme.text, marginBottom: 10 }}>
          {selectedCategory?.categoryName || 'Category'}
        </Text>
      </View>

      {/* Check if user roles are not null before comparing */}
      {(!state.userRole || !selectedCategory || !selectedCategory.userRole || state.userRole !== selectedCategory.userRole) && (
        <Text className='mt-2' style={{ color: theme.text, marginBottom: 10 }}>
          You cannot update or delete this category. This is a default category of the app.
        </Text>
      )}

<TouchableOpacity
  onPress={() => handleUpdate()}
  style={[
    styles.optionButton,
    (!state.userRole || !selectedCategory || !selectedCategory.userRole || state.userRole !== selectedCategory.userRole) && { backgroundColor: '#ccc' },
  ]}
  disabled={!state.userRole || !selectedCategory || !selectedCategory.userRole || state.userRole !== selectedCategory.userRole}
>
  <Text style={{ color: theme.text }}>Update</Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={() => handleDeleteCategory(selectedCategory?.categoryId)} // Wrap the call in an anonymous function
  style={[
    styles.optionButton,
    (!state.userRole || !selectedCategory || !selectedCategory.userRole || state.userRole !== selectedCategory.userRole) && { backgroundColor: '#ccc' },
  ]}
  disabled={!state.userRole || !selectedCategory || !selectedCategory.userRole || state.userRole !== selectedCategory.userRole}
>
  <Text style={{ color: theme.text }}>Delete</Text>
</TouchableOpacity>

      <TouchableOpacity
        onPress={() => setOptionsModalVisible(false)}
        style={styles.optionButton}
      >
        <Text style={{ color: theme.text }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      <CustomAlert
        visible={isModalVisible}
        title="Confirm Delete"
        message="Are you sure you want to delete this transaction?"
        confirmText="Delete"
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmDeleteCategory}
        theme={theme}
        type='warning'
      />

      <CustomAlert
        visible={alertVisible}
        title={alertType === 'success' ? "Success" : "Error"}
        message={alertMessage}
        confirmText="OK"
        onOk={() => setAlertVisible(false)} // You can use the same handler for both types
        theme={theme}
        type={alertType} // Use the alert type to control styling
      />

    </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
});

export default ExpenseCategory;