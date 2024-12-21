import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import apiClient from '../../../apiClient';
import SaveButton from '../../components/SaveButton';
import { useTheme } from '../../themes/ThemeContext';
import CustomAlert from '../../components/common/CustomAlert';

const UpdateCategory = ({ route }) => {
  const navigation = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();
  const { categoryType } = route.params;

  // State for alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  // Local states
  const [categoryId, setCategoryId] = useState(state.categoryId ?? '');
  const [categoryName, setCategoryName] = useState(state.categoryName ?? '');
  const [selectIconId, setSelectIconId] = useState(state.selectIconId ?? '');
  const [parentCategoryName, setParentCategoryName] = useState(state.parentCategoryName ?? null);
  const [parentCategoryId, setParentCategoryId] = useState(state.parentCategoryId);

    // Animated values for shaking
    const categoryNameShake = useRef(new Animated.Value(0)).current;
    const iconShake = useRef(new Animated.Value(0)).current;
  
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

  useEffect(() => {
    setParentCategoryName(state.parentCategoryName);
    setParentCategoryId(state.parentCategoryId);
    setSelectIconId(state.selectIconId);
  }, [state.parentCategoryName, state.selectIconId, state.categoryName, state.categoryId]);

  const handleUpdate = async () => {
    if(!state.selectIconId){
      shakeAnimation(iconShake);
      return;
    }
 
    if (!categoryName) {
      shakeAnimation(categoryNameShake);
      return;
    }

    const payload = {
      name: categoryName,
      type: categoryType,
      icon_id: selectIconId,
      parent_id: parentCategoryId,
      user_id: state.userId,
    };

    try {
      const response = await apiClient.put(`/categories/${categoryId}`, payload);

      if (response.status === 200) {
        setAlertMessage('Category updated successfully!');
        setAlertType('success');
        setAlertVisible(true);

        // Reset state
        dispatch({ type: 'SET_ICON_IMAGE', payload: null });
        dispatch({ type: 'SET_ICON_ID', payload: null });
        dispatch({
          type: 'SET_CATEGORY',
          payload: {
            parentCategoryId: null,
            parentCategoryName: null,
            categoryId: null,
            categoryName: null,
            categoryImage: null,
          },
        });

        setTimeout(() => {
          setAlertVisible(false);
          navigation.goBack();
        }, 2000);
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.error || 'Failed to update category.');
      setAlertType('error');
      setAlertVisible(true);
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
          <Animated.Image
            source={state.selectIconImage ? { uri: state.selectIconImage } : require('../../../assets/default-icon.png')}
            style={[styles.image, { transform: [{ translateX: iconShake }] }]}
          />
        </TouchableOpacity>

          <Animated.View style={{width:100, flex:1, transform: [{ translateX: categoryNameShake }]}}>
            <TextInput
              style={[styles.input, {color:theme.text}]}
              placeholder="Category Name"
              placeholderTextColor={theme.subtext}
              value={categoryName}
              onChangeText={(value) => setCategoryName(value)}
            />
          </Animated.View>
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
                {parentCategoryName ?? 'Select Category'}
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
