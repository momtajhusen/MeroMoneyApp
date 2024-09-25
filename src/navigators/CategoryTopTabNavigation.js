// Import libraries
import React, { useContext } from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExpenseCategory from '../screens/Category/expenseCategory';
import IncomeCategory from '../screens/Category/IncomeCategory';
import { AppContext } from '../context/AppContext';
import  { useTheme } from '../themes/ThemeContext';

const Tab = createMaterialTopTabNavigator();

const SelectCategoryTabNavigation = () => {

    const { state } = useContext(AppContext);
    const { theme } = useTheme();
    
    return (
        <View style={{ flex: 1, backgroundColor: theme.primary, padding: 0, margin: 0 }}>
            <Tab.Navigator
                initialRouteName="EXPENSE" 
                backBehavior="initialRoute" 
                tabBarPosition="top" 
                sceneContainerStyle={{ backgroundColor: theme.primary }} 
                screenOptions={{
                    tabBarStyle: { 
                        backgroundColor: theme.primary, 
                    }, 
                    tabBarIndicatorStyle: { 
                        backgroundColor: theme.accent, 
                        height: 4 
                    },  
                    tabBarLabelStyle: { 
                        fontSize: 14, 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase', 
                    },  
                    tabBarActiveTintColor: theme.accent, // Active tab label color
                    tabBarInactiveTintColor: theme.text, // Inactive tab label color
                    tabBarPressColor: theme.secondary, // Ripple effect color on press (Android)
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
