// Import libraries
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
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
        <View style={{ flex: 1, backgroundColor: theme.primary, padding: 0, margin: 0,  }}>
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
                    tabBarActiveTintColor: theme.accent,
                    tabBarInactiveTintColor: theme.text,
                    tabBarPressColor: theme.secondary, 
                    tabBarShowLabel: true,  
                    tabBarScrollEnabled: false, 
                    tabBarItemStyle: { width: 'auto' },  
                }}
            >
  <Tab.Screen 
    name="EXPENSE" 
    component={ExpenseCategory} 
    options={{ title: 'Expense' }} 
  />
  <Tab.Screen 
    name="INCOME" 
    component={IncomeCategory} 
    options={{ title: 'Income' }} 
  />
            </Tab.Navigator>
        </View>
    );
};

// Make this component available to the app
export default SelectCategoryTabNavigation;
