import React, { useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image, Modal, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../../apiClient';
import CustomAlert from '../../components/common/CustomAlert';


const CategoryScreen = ({ type }) => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const BASE_URL = 'https://finance.scriptqube.com/storage/';
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  // Fetch and organize category data
  const fetchCategoryData = async () => {
    try {
      const response = await apiClient.get('/categories');
      const categoriesOfType = response.data.filter(category => category.type === type);

      const parentCategories = categoriesOfType.filter(category => category.parent_id === null);
      const childCategories = categoriesOfType.filter(category => category.parent_id !== null);

      parentCategories.sort((a, b) => b.transaction_count - a.transaction_count);

      const sortedCategories = parentCategories.map(parent => {
        const children = childCategories
          .filter(child => child.parent_id === parent.id)
          .sort((a, b) => b.transaction_count - a.transaction_count);

        return { ...parent, children };
      });

      setCategories(sortedCategories);
      setFilteredCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (!text.trim()) {
      setFilteredCategories(categories);
    } else {
      const lowercasedText = text.toLowerCase();
      const matchedCategories = categories
        .map(parent => {
          const parentMatch = parent.name.toLowerCase().includes(lowercasedText);
          const matchingChildren = parent.children.filter(child =>
            child.name.toLowerCase().includes(lowercasedText)
          );

          if (parentMatch || matchingChildren.length > 0) {
            return { ...parent, children: matchingChildren };
          }
          return null;
        })
        .filter(category => category !== null);

      setFilteredCategories(matchedCategories);
    }
  };

  const categoryPress = (parentCategoryId, categoryId, parentCategoryName, categoryName, categoryImage, iconId, userRole, categoryType) => {
    // Dispatch category selection
    dispatch({ 
      type: 'SET_CATEGORY', 
      payload: { categoryId, categoryName, categoryImage } 
    });
  
    // Dispatch category type (Expense or Income)
    if (categoryType === 'Expense' || categoryType === 'Income') {
      dispatch({ type: 'SET_CATEGORY_SELECT_TYPE', payload: categoryType });
    }
  
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
    if (!selectedCategory) return;

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
    navigation.navigate('UpdateCategory', { categoryType: type });
  };

  const handleDeleteCategory = () => {
    setModalVisible(true);
  };

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    setModalVisible(false);

    try {
      const response = await apiClient.delete(`/categories/${selectedCategory.categoryId}`);
      if (response.status === 200 || response.status === 204) {
        setAlertMessage('Category deleted successfully.');
        setAlertType('success');
        fetchCategoryData();
      } else {
        setAlertMessage('Failed to delete the category.');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlertMessage('An error occurred while deleting the category.');
      setAlertType('error');
    } finally {
      setOptionsModalVisible(false);
      setAlertVisible(true);
    }
  };

  const renderCategories = ({ item: parentCategory }) => (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.secondary, padding: 10 }}
        onPress={() =>
          categoryPress(
            parentCategory.id,
            parentCategory.id,
            parentCategory.name,
            parentCategory.name,
            BASE_URL + parentCategory.icon_path,
            parentCategory.icon_id,
            parentCategory.user_role,
            parentCategory.type // ✅ अब category type भी pass किया गया
          )
        }
      >
        <Image source={{ uri: `${BASE_URL}${parentCategory.icon_path}` }} style={styles.iconStyle} />
        <Text style={{ color: theme.text }}>{parentCategory.name}</Text>
      </TouchableOpacity>
      {parentCategory.children.map(childCategory => (
        <TouchableOpacity
          key={childCategory.id}
          style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, padding: 10 }}
          onPress={() =>
            categoryPress(
              parentCategory.id,
              childCategory.id,
              parentCategory.name,
              childCategory.name,
              BASE_URL + childCategory.icon_path,
              childCategory.icon_id,
              childCategory.user_role,
              childCategory.type // ✅ अब category type भी pass किया गया
            )
          }
        >
          <Image source={{ uri: `${BASE_URL}${childCategory.icon_path}` }} style={styles.iconStyle} />
          <Text style={{ color: theme.text }}>{childCategory.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  useFocusEffect(
    useCallback(() => {
      fetchCategoryData();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.primary, padding: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.secondary, color: theme.text }]}
          placeholder={`Search ${type} Categories...`}
          placeholderTextColor={theme.subtext}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.secondary, marginLeft: 10 }]}
          onPress={() => navigation.navigate('NewCategory', { categoryType: type })}
        >
          <MaterialIcons name="add" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCategories}
        renderItem={renderCategories}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={{ color: theme.text, textAlign: 'center' }}>No categories found</Text>}
      />

      {/* Options Modal */}
      <Modal
        transparent
        visible={isOptionsModalVisible}
        animationType="slide"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: theme.secondary }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: selectedCategory?.categoryImage }} style={styles.iconStyle} />
              <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>
                {selectedCategory?.categoryName || 'Category'}
              </Text>
            </View>

            {(!state.userRole || !selectedCategory || !selectedCategory.userRole || state.userRole !== selectedCategory.userRole) && (
              <Text style={{ color: theme.text, marginTop: 10 }}>
                You cannot update or delete this category. This is a default category of the app.
              </Text>
            )}

            <TouchableOpacity
              onPress={handleUpdate}
              style={[
                styles.optionButton,
                (!state.userRole || !selectedCategory?.userRole || state.userRole !== selectedCategory?.userRole) && { backgroundColor: '#ccc' },
              ]}
              disabled={!state.userRole || !selectedCategory?.userRole || state.userRole !== selectedCategory?.userRole}
            >
              <Text style={{ color: theme.text }}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteCategory}
              style={[
                styles.optionButton,
                (!state.userRole || !selectedCategory?.userRole || state.userRole !== selectedCategory?.userRole) && { backgroundColor: '#ccc' },
              ]}
              disabled={!state.userRole || !selectedCategory?.userRole || state.userRole !== selectedCategory?.userRole}
            >
              <Text style={{ color: theme.text }}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOptionsModalVisible(false)} style={styles.optionButton}>
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
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    paddingVertical:13,
  },
  iconButton: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
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

export default CategoryScreen;
