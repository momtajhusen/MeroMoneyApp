//import liraries
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';

// create a component
const Budgets = () => {
    const { state, dispatch } = useContext(AppContext);
    const { theme } = useTheme();

    return (
        <View className="p-4 flex-1 justify-center items-center" style={{ backgroundColor: theme.primary }}>
            <View className="justify-center items-center p-4 rounded-md">
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>You have no budget</Text>
                <Text style={{ color: theme.subtext, marginTop:3, textAlign:"center" }}>Start saving money by creating budgets and {'\n'} we will help you stick to it</Text>
            </View>
        </View>
    );
};

//make this component available to the app
export default Budgets;
