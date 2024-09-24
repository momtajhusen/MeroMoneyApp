//import liraries
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { lightTheme, darkTheme } from '../../themes'; 


// create a component
const DeveloperMode = () => {

   const navigation = useNavigation();

   const { state, dispatch } = useContext(AppContext);
   const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; 

    return (
        <View className="p-4 flex-1" style={{backgroundColor:themeColor.primary}}>
            <View className="space-y-2">
                 <TouchableOpacity 
                    className="p-4 mb-0.1"
                    style={{backgroundColor:themeColor.secondary, borderRadius:8}}
                    onPress={() => {navigation.navigate('IconUpload')}}
                    >
                    <Text style={{color:themeColor.text}}>Upload Icon</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                    className="p-4 mb-0.1"
                    style={{backgroundColor:themeColor.secondary, borderRadius:8}}
                    onPress={() => {navigation.navigate('CurrencyUpload')}}
                    >
                    <Text style={{color:themeColor.text}}>Upload Currency</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                    className="p-4 mb-0.1"
                    style={{backgroundColor:themeColor.secondary, borderRadius:8}}
                    onPress={() => {navigation.navigate('AllIcons')}}
                    >
                    <Text style={{color:themeColor.text}}>All Icons</Text>
                 </TouchableOpacity>
            </View>
        </View>
    );
};

//make this component available to the app
export default DeveloperMode;
