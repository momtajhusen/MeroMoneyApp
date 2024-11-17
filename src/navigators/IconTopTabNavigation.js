//import liraries
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CategorySelectIcon from '../screens/IconScreen/categorysIcons';
import WalletsIcons from '../screens/IconScreen/walletsIcons';
import { useTheme } from '../themes/ThemeContext';


const Tab = createMaterialTopTabNavigator();

// create a component
const SelectIconTabNavigation = () => {

  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor:  theme.primary, // Background color of the tab bar
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.accent, // Color of the active tab indicator
          height: 4, // Height of the indicator
        },
        tabBarLabelStyle: {
          fontSize: 14, // Font size for tab labels
          fontWeight: 'bold',
          color: theme.text, // Color of the tab label
        },
      }}
    >
      <Tab.Screen name="Category" component={CategorySelectIcon} />
      <Tab.Screen name="Wallets" component={WalletsIcons} />
    </Tab.Navigator>
  );
};

//make this component available to the app
export default SelectIconTabNavigation;
