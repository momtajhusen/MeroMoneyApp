//import liraries
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { lightTheme, darkTheme } from '../themes'; 
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../themes/ThemeContext';

// create a component
const Dashboard = () => {

    const { state, dispatch } = useContext(AppContext);
    const { theme } = useTheme();

    return (
        <View className="flex-1 p-4" style={{backgroundColor:theme.primary}}>
            <Text style={{color:theme.text}}>Dashboard</Text>
        </View>
    );
};
 
//make this component available to the app
export default Dashboard;
