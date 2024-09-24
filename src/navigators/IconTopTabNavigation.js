//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CategorySelectIcon from '../screens/IconScreen/categorysIcons';
import WalletsIcons from '../screens/IconScreen/walletsIcons';


const Tab = createMaterialTopTabNavigator();

// create a component
const SelectIconTabNavigation = () => {
    return (
        <Tab.Navigator>
          <Tab.Screen name="Category" component={CategorySelectIcon} />
          <Tab.Screen name="Wallets" component={WalletsIcons} />
        </Tab.Navigator>
    );
};

//make this component available to the app
export default SelectIconTabNavigation;


