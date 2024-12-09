import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import apiClient from '../../../apiClient';
import SaveButton from '../../components/SaveButton';
import { useTheme } from '../../themes/ThemeContext';

const UpdateCategory = ({ route }) => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const { categoryType } = route.params;
 
  // Initialize local states using global state values as defaults
  const [categoryId, setCategoryId] = useState(state.categoryId ?? '');
  const [categoryName, setCategoryName] = useState(state.categoryName ?? '');
  const [selectIconId, setSelectIconId] = useState(state.selectIconId ?? '');
  const [parentCategoryName, setParentCategoryName] = useState(state.parentCategoryName ?? null);
  const [parentCategoryId, setParentCategoryId] = useState(state.parentCategoryId ?? null);

  useEffect(() => {
    // Update local state if global state changes
    setCategoryName(state.categoryName ?? '');
    setParentCategoryId(state.parentCategoryId ?? null);
  }, [state.categoryName, state.categoryId]);

  const handleUpdate = async () => {
    // Validate inputs
    if (!categoryName || !state.selectIconId) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
  
    // Create the payload object
    const payload = {
      name: categoryName,
      type: categoryType,
      icon_id: selectIconId,
      parent_id: parentCategoryId,
      user_id: state.userId,
    };

    console.log(payload);
  
    try {
      // Send the payload to the API
      const response = await apiClient.put(`/categories/${categoryId}`, payload);
  
      if (response.status === 200) {
        Alert.alert('Success', 'Category updated successfully!');
        dispatch({ type: 'SET_ICON_IMAGE', payload: null });
        dispatch({ type: 'SET_ICON_ID', payload: null });
        navigation.goBack(); // Navigate back to the previous screen
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update category. Please try again.');
      console.error(error);
    }
  };
  

  return (
    <View className="p-5 flex-1" style={{ backgroundColor: theme.primary }}>
      {/* Category Name Input */}
      <View className="p-2" style={[styles.row, { backgroundColor: theme.secondary }]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SelectItonsTabs');
          }}
        >
          <Image
            source={state.selectIconImage ? { uri: state.selectIconImage } : { uri: categoryImage }}
            style={styles.image}
          />
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Category Name"
          placeholderTextColor={theme.subtext}
          value={categoryName}
          onChangeText={(value) => setCategoryName(value)}
        />
      </View>

      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        style={[styles.touchableRipple, { backgroundColor: theme.secondary }]}
        className="p-3 mb-5"
      >
        <View style={styles.touchableContent}>
          <Image source={require('../../../assets/exp-inc.png')} style={{ width: 20, height: 20 }} />

          <View className="ml-5" style={{ width: '85%' }}>
            <View className="flex-row justify-between">
              <Text style={{ fontWeight: 'bold', color: theme.subtext }}>{categoryType ?? 'Type'}</Text>
            </View>
          </View>
        </View>
      </TouchableRipple>

      {/* Select category */}
      <TouchableRipple
        onPress={() => {
          if (categoryType === 'Expense') {
            navigation.navigate('ParentExpensiveCategory');
          } else if (categoryType === 'Income') {
            navigation.navigate('ParentIncomeCategory');
          }
        }}
        rippleColor="rgba(0, 0, 0, .32)"
        style={[styles.touchableRipple, { backgroundColor: theme.secondary }]}
      >
        <View className="p-2 py-0" style={[styles.touchableContent]}>
          <MaterialIcons color={theme.text} name="category" size={22} />

          <View className="ml-5" style={{ width: '85%' }}>
            <Text style={{ color: theme.text }}>Parent category</Text>
            <View className="flex-row justify-between">
            <Text style={{ fontWeight: 'bold', color: state.categoryName ? theme.subtext : theme.text }}>
                {state.parentCategoryName ?? 'Select Category'}
              </Text>

              {state.parentCategoryId !== null && (
                <TouchableOpacity
                  onPress={() =>
                    dispatch({ type: 'SET_CATEGORY', payload: { parentCategoryId: null, parentCategoryName: null } })
                  }
                >
                  <MaterialIcons color={theme.text} name="cancel" size={22} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableRipple>

      <SaveButton title="Update" onPress={handleUpdate} />
    </View>
  );
};

export default UpdateCategory;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  touchableRipple: {
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  touchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
