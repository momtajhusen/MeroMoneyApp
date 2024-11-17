//import liraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CategoryTabNavigation from '../../navigators/CategoryTopTabNavigation';

// create a component
const Categories = () => {
    return (
        <View className="flex-1">
            <CategoryTabNavigation />
        </View>
    );
};

 
//make this component available to the app
export default Categories;
