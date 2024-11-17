// components/Container.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Container = ({ children, style }) => {
  return (
    <View className='p-0' style={[style]}>
      {children}
    </View>
  );
};

export default Container;
