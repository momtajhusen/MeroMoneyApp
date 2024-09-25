//import liraries
import React,{useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppContext } from '../../context/AppContext';
import  { useTheme } from '../../themes/ThemeContext'

// create a component
const Budgets = () => {

    const { state, dispatch } = useContext(AppContext);
    const { theme } = useTheme();


    return (
        <View className="p-4 flex-1" style={{backgroundColor:theme.primary}}>
            <Text style={{color:theme.text}}>Budgets</Text>
        </View>
    );
};
 
//make this component available to the app
export default Budgets;
