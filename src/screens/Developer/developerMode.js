//import liraries
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import  { useTheme } from '../../themes/ThemeContext';


// create a component
const DeveloperMode = () => {

   const navigation = useNavigation();

   const { state, dispatch } = useContext(AppContext);
   const { theme } = useTheme();

    return (
        <View className="p-4 flex-1" style={{backgroundColor:theme.primary}}>
            <View className="space-y-2">
                 <TouchableOpacity 
                    className="p-4 mb-0.1"
                    style={{backgroundColor:theme.secondary, borderRadius:8}}
                    onPress={() => {navigation.navigate('IconUpload')}}
                    >
                    <Text style={{color:theme.text}}>Upload Icon</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                    className="p-4 mb-0.1"
                    style={{backgroundColor:theme.secondary, borderRadius:8}}
                    onPress={() => {navigation.navigate('CurrencyUpload')}}
                    >
                    <Text style={{color:theme.text}}>Upload Currency</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                    className="p-4 mb-0.1"
                    style={{backgroundColor:theme.secondary, borderRadius:8}}
                    onPress={() => {navigation.navigate('AllIcons')}}
                    >
                    <Text style={{color:theme.text}}>All Icons</Text>
                 </TouchableOpacity>
            </View>
        </View>
    );
};

//make this component available to the app
export default DeveloperMode;
