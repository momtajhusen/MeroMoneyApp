import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { rw, rh, rf } from '../themes/responsive';


// Dynamically import the themes
const themes = require('../themes/index.js'); // Adjust the path as necessary

const ThemesSelect = ({ navigation }) => {
    const { theme, changeTheme } = useTheme(); // Destructuring theme and changeTheme together

    // Get all theme names and objects as an array
    const themeEntries = Object.entries(themes);

    // Function to handle storing the selected theme
    const handleCardClick = async (selectedThemeName, selectedThemeData) => {
        try {
            await changeTheme(selectedThemeData); // Pass theme data here
            navigation.goBack(); 
        } catch (error) {
            console.error('Error saving theme to AsyncStorage:', error);
        }
    };

    return (
        <View
            className="flex-1 flex-row flex-wrap justify-around"
            style={{ backgroundColor: theme.primary, padding: 10 }}
        >
            {themeEntries.map(([themeName, themeData], index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleCardClick(themeName, themeData)} // Pass theme data
                >
                    <Card
                        className="mb-4"
                        style={{
                            height: 240,
                            width: 170,
                            backgroundColor: themeData.secondary,
                            borderWidth: 1,
                            borderColor: themeData.border,
                            marginBottom: 10,
                            overflow:"hidden"
                        }}
                    >
                        <View className="items-end p-3" style={{ height: 200, backgroundColor:themeData.primary }} >
                          {theme === themeData && (
                                <MaterialIcons
                                    color={themeData.accent}
                                    name="task-alt"
                                    size={24}
                                />
                            )}
                        </View>

                        <Text
                            className="font-bold text-center mt-2"
                            style={{ color: themeData.text }}
                        >
                            {themeName}
                        </Text>
                    </Card>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ThemesSelect;