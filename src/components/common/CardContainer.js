// import libraries
import React from 'react';
import { View, StyleSheet } from 'react-native';

// create a component
const CardContainer = ({ children }) => {
    console.log(children); 
    return (
        <View style={styles.container}>
            {children} {/* Render children content here */}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        padding: 15,
    },
});

// export the component
export default CardContainer;
