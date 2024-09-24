// Import libraries
import React,{useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';
import { lightTheme, darkTheme } from '../../themes'; 

// Create a component
const ListItems = ({ icon, title, onPress }) => {

    const { state, dispatch } = useContext(AppContext);
    const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; 

    return (
        <TouchableRipple
            onPress={onPress}
            rippleColor="rgba(0, 0, 0, .32)"
            style={{backgroundColor:themeColor.secondary, borderRadius:8}}
            className="mb-1"
        > 
            <View className="flex-row p-4 items-center justify-between">
                <View className="flex-row space-x-3 items-center mr-4">
                    <MaterialIcons color={themeColor.text} name={icon} size={25} /> 
                    <Text style={{color:themeColor.text}}>{title}</Text>
                </View>
                <MaterialIcons color={themeColor.text} name="arrow-forward-ios" size={15} />
            </View>
        </TouchableRipple>
    );
};

// Make this component available to the app
export default ListItems;
