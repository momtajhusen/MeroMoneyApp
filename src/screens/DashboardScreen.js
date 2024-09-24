//import liraries
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { lightTheme, darkTheme } from '../themes'; 
import { View, Text, StyleSheet } from 'react-native';

// create a component
const Dashboard = () => {

    const { state, dispatch } = useContext(AppContext);
    const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; 

    return (
        <View className="flex-1 p-4" style={{backgroundColor:themeColor.primary}}>
            <Text style={{color:themeColor.text}}>Dashboard</Text>
        </View>
    );
};
 
//make this component available to the app
export default Dashboard;
