//import liraries
import React, { Component } from 'react';
import { View} from 'react-native';
import SelectIconTabNavigation from '../../navigators/IconTopTabNavigation';

// create a component
const SelectItonsTabs= () => {
    return (
        <View className="p-1 flex-1">
            <SelectIconTabNavigation />
        </View>
    );
};

//make this component available to the app
export default SelectItonsTabs;
 