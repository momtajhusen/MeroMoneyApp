// CategorySelector.js
import React,{useContext} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import  { useTheme } from '../themes/ThemeContext';

const CategorySelector = ({ onPress, categoryImage, categoryName }) => {

  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  return (
    <TouchableOpacity className="mb-0.5" onPress={onPress} style={[styles.container, {backgroundColor:theme.secondary}]}>
        <Image
          source={state.categoryImage ? { uri: state.categoryImage } : require('../../assets/default-icon.png')}
          style={styles.image}
        />
      <Text style={[styles.text, {color:theme.text}]}>{categoryName || 'Select Category'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius:5,
  },
  text: {
    fontSize: 16,
  },
});

export default CategorySelector;
