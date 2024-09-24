//import liraries
import React,{useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { lightTheme, darkTheme } from '../../themes'; 

// create a component
const Budgets = () => {

    const { state, dispatch } = useContext(AppContext);
    const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; 

    return (
        <View className="p-4 flex-1" style={{backgroundColor:themeColor.primary}}>
            <Text style={{color:themeColor.text}}>Budgets</Text>
        </View>
    );
};
 
//make this component available to the app
export default Budgets;
