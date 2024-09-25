import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dark } from '../themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(Dark);

    const changeTheme = async (newTheme) => {
        setTheme(newTheme);
        // Save the new theme to AsyncStorage as a string
        await AsyncStorage.setItem('selectTheme', JSON.stringify(newTheme));
    };

    const handleCardClick = async (selectedThemeData) => {
        await changeTheme(selectedThemeData); // Pass the selected theme data
    };

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('selectTheme');
                if (storedTheme) {
                    // Try to parse the stored theme
                    try {
                        setTheme(JSON.parse(storedTheme));
                    } catch (parseError) {
                        console.error('Error parsing stored theme, using default:', parseError);
                        setTheme(Dark);
                    }
                } else {
                    setTheme(Dark); // Default to Dark if no stored theme
                }
            } catch (error) {
                console.error('Error loading theme from AsyncStorage:', error);
                setTheme(Dark); // Default to Dark on error
            }
        };

        loadTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, changeTheme, handleCardClick }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
