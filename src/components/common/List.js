// Import libraries
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../themes/ThemeContext';
import { rw, rh, rf } from '../../themes/responsive';

// Create a component
const ListItems = ({ icon, title, subtitle, onPress, showArrow = true }) => {
    const { state, dispatch } = useContext(AppContext);
    const { theme } = useTheme();

    return (
        <TouchableRipple
            onPress={onPress}
            rippleColor="rgba(0, 0, 0, .32)"
            style={[styles.touchable, { backgroundColor: theme.secondary }]}
        >
            <View style={styles.container}>
                <View style={styles.iconTextContainer}>
                    <MaterialIcons color={theme.accent} name={icon} size={rf(3)} />
                    <View>
                        <Text style={[styles.text, { color: theme.text }]}>{title}</Text>
                        {subtitle ? (
                            <Text style={[styles.text, { color: theme.text, fontSize: 12 }]}>
                                {subtitle}
                            </Text>
                        ) : null}
                    </View>
                </View>
                {showArrow && (
                    <MaterialIcons color={theme.accent} name="arrow-forward-ios" size={rf(2.2)} />
                )}
            </View>
        </TouchableRipple>
    );
};

// Make this component available to the app
export default ListItems;

// Styles
const styles = StyleSheet.create({
    touchable: {
        borderRadius: 8,
        marginBottom: rh(0.5), // Responsive bottom margin
    },
    container: {
        flexDirection: 'row',
        paddingHorizontal: rw(4), // Responsive horizontal padding
        paddingVertical: rh(2), // Responsive vertical padding
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: rw(4), // Adjust right margin for better spacing
    },
    text: {
        fontSize: rf(2), // Responsive text size
        marginLeft: rw(3), // Responsive left margin for spacing between icon and text
    },
});
