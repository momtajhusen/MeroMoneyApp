//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { rw, rh, rf } from '../themes/responsive';  
import { useTheme } from '../themes/ThemeContext';


// create a component
const Notification = () => {

    const { theme } = useTheme(); 

    return (
        <View style={[styles.container, {backgroundColor:theme.primary}]}>
            <Text style={{fontWeight:"bold", color:theme.text}}>No Notification</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

//make this component available to the app
export default Notification;
