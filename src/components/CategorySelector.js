// CategorySelector.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../themes/ThemeContext';
import { rw, rh, rf } from '../themes/responsive';

const CategorySelector = ({ onPress, categoryImage, categoryName }) => {

  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: theme.secondary }]}>
      <Image
        source={state.categoryImage ? { uri: state.categoryImage } : require('../../assets/default-icon.png')}
        style={styles.image}
      />
      <Text
        style={[
          styles.text,
          {
            color: theme.text,
            fontWeight: categoryName ? 'bold' : 'normal'
          }
        ]}
      >
        {categoryName || 'Select Category'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rw(3),   // Responsive horizontal padding
    paddingVertical: rh(1),     // Responsive vertical padding
    marginVertical: rh(0.2),      // Responsive margin between items
    borderRadius: rf(0.5),        // Rounded corners for container
  },
  image: {
    width: rw(8.5),    // Responsive image width
    height: rw(8.5),   // Keeping image height same as width for square shape
    marginRight: rw(4), // Space between image and text
    borderRadius: rw(2), // Rounded corners for the image
  },
  text: {
    fontSize: rf(2),   // Responsive text size
    flex: 1,           // Text takes the remaining space
    textAlign: 'left', // Align text to the left
    paddingRight: rw(4), // Padding to ensure text does not touch the edge
  },
});

export default CategorySelector;
