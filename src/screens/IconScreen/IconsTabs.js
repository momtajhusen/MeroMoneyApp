//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity} from 'react-native';
import SelectIconTabNavigation from '../../navigators/IconTopTabNavigation';
import { useTheme } from '../../themes/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';



// create a component
const SelectItonsTabs= ({navigation}) => {
  const { theme } = useTheme();

    return (
        <View className="p-1 flex-1" style={{backgroundColor:theme.primary}}>
            <SelectIconTabNavigation />
            <TouchableOpacity onPress={() => navigation.navigate('IconUpload')} className="p-3" style={{backgroundColor:theme.accent, borderRadius:10, position:"absolute", bottom:20, right:30}}>
           <MaterialIcons color={theme.text} name="add" size={22} />
        </TouchableOpacity>
        </View>
    );
};

//make this component available to the app
export default SelectItonsTabs;
 