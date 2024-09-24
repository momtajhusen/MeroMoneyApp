import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import apiClient from '../../../apiClient'; // Make sure this is properly set up

const NewCategory = ({ route }) => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);

  const { categoryType } = route.params;

  const [categoryName, setCategoryName] = useState(null);
  const [parentCategoryId, setParentCategoryId] = useState(null);
  

  useEffect(() => {
    setParentCategoryId(state.categoryId);
  }, [state.categoryId]);

  const handleSave = async () => {
    // Validate inputs
    if (!categoryName || !state.selectIconId) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
  
    try {
      const response = await apiClient.post('/categories', {
        name: categoryName,
        type: categoryType,
        icon_id: state.selectIconId,
        parent_id: parentCategoryId,
        user_id: state.userId,
      });
  
      if (response.status === 201) {
        Alert.alert('Success', 'Category created successfully!');
        dispatch({ type: 'SET_ICON_IMAGE', payload: null });
        dispatch({ type: 'SET_ICON_ID', payload: null });
        setCategoryName(null);  // Correct setter function here
        setParentCategoryId(null);
        navigation.goBack(); // Navigate back to the previous screen
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create category. Please try again.');
      console.error(error);
    }
  };
  

  return (
    <View style={{ padding: 10 }}>
      <View style={styles.card}>
        {/* Category Name Input */}
        <View style={styles.row}>
          <TouchableOpacity 
            onPress={() => { navigation.navigate('SelectItonsTabs'); }} 
          >
            <Image
              source={state.selectIconImage ? { uri: state.selectIconImage } : require('../../../assets/default-icon.png')}
              style={styles.image}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Category Name"
            value={categoryName}
            onChangeText={(value) => setCategoryName(value)}
          />
        </View>

        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .32)"
          style={styles.touchableRipple}
        >
          <View style={styles.touchableContent}>
          <Image
              source={state.selectIconImage ? { uri: state.selectIconImage } : require('../../../assets/exp-inc.png')}
              style={{width:20, height:20}}
            />
            
            <View className="ml-5" style={{width:'85%'}}>
              <View className="flex-row justify-between">
                 <Text style={{ fontWeight: 'bold' }}>{categoryType ?? 'Type'}</Text>
              </View>
            </View>
          </View>
        </TouchableRipple>

        {/* Select category */}
        <TouchableRipple
            onPress={() => {
              if (categoryType === "Expense") {
                navigation.navigate('ParentExpensiveCategory');
              } else if (categoryType === "Income") {
                navigation.navigate('ParentIncomeCategory');
              }
            }}
          rippleColor="rgba(0, 0, 0, .32)"
          style={styles.touchableRipple}
        >
          <View style={styles.touchableContent}>
            <MaterialIcons
              color="black"
              name="category"
              size={22}
            />
            
            <View className="ml-5" style={{ width: '85%' }}>
              <Text>Parent category</Text>
              <View className="flex-row justify-between">
                <Text style={{ fontWeight: 'bold' }}>{state.categoryName ?? 'Select Category'}</Text>
                
                {/* Cancel icon should only show when categoryId is not null */}
                {state.categoryId !== null && (
                  <TouchableOpacity
                    onPress={() =>
                      dispatch({ type: 'SET_CATEGORY', payload: { categoryId: null, categoryName: null } })
                    }
                  >
                    <MaterialIcons color="black" name="cancel" size={22} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

          </View>
        </TouchableRipple>

        <TouchableRipple
          onPress={handleSave}
          rippleColor="rgba(0, 0, 0, .32)"
          style={{ backgroundColor: "#ddd", borderRadius: 10 }}
          className="mt-5 p-3"
        >
          <View>
            <Text style={{ textAlign: 'center' }}>Save</Text>
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
};

export default NewCategory;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
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
    marginRight: 10, // Adds space between the image and text
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
  }
});
