// Import libraries
import React, { useContext } from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExpenseCategory from '../screens/Category/expenseCategory';
import IncomeCategory from '../screens/Category/IncomeCategory';
import { AppContext } from '../context/AppContext';
import { lightTheme, darkTheme } from '../themes'; 

const Tab = createMaterialTopTabNavigator();

const SelectCategoryTabNavigation = () => {

    const { state } = useContext(AppContext);
    const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme;

    return (
        <View style={{ flex: 1, backgroundColor: themeColor.primary, padding: 0, margin: 0 }}>
            <Tab.Navigator
                initialRouteName="EXPENSE" 
                backBehavior="initialRoute" 
                tabBarPosition="top" 
                sceneContainerStyle={{ backgroundColor: themeColor.primary }} 
                screenOptions={{
                    tabBarStyle: { 
                        backgroundColor: themeColor.primary, 
                    }, 
                    tabBarIndicatorStyle: { 
                        backgroundColor: themeColor.accent, 
                        height: 4 
                    },  
                    tabBarLabelStyle: { 
                        fontSize: 14, 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase', 
                    },  
                    tabBarActiveTintColor: themeColor.accent, // Active tab label color
                    tabBarInactiveTintColor: themeColor.text, // Inactive tab label color
                    tabBarPressColor: themeColor.secondary, // Ripple effect color on press (Android)
                    tabBarShowLabel: true, // Show label on the tab
                    tabBarScrollEnabled: false, // Whether the tab bar is scrollable
                    tabBarItemStyle: { width: 'auto' }, // Individual tab item style
                }}
            >
                <Tab.Screen 
                    name="EXPENSE" 
                    component={ExpenseCategory} 
                    options={{
                        title: 'Expense', // Title of the screen
                        tabBarLabel: 'Expense', // Custom label for the tab
                    }} 
                />
                <Tab.Screen 
                    name="INCOME" 
                    component={IncomeCategory} 
                    options={{
                        title: 'Income', // Title of the screen
                        tabBarLabel: 'Income', // Custom label for the tab
                    }} 
                />
            </Tab.Navigator>
        </View>
    );
};

// Make this component available to the app
export default SelectCategoryTabNavigation;
