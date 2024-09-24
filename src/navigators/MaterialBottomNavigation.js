// Import libraries
import React, { useContext } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Dashboard from '../screens/DashboardScreen';
import Wallet from '../screens/Wallet/MyWalletScreen';
import Account from '../screens/Accounts';
import AddTransaction from '../screens/Transaction/AddTransaction';
import TransactionHistory from '../screens/Transaction/TransactionHistory';
import Budgets from '../screens/Budgets/budgets';
import { lightTheme, darkTheme } from '../themes';
import { AppContext } from '../context/AppContext';

const Tab = createMaterialBottomTabNavigator();

// Create a component
const MaterialBottomNavigation = () => {
  const { state } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={themeColor.tertiary}
      barStyle={{ backgroundColor: themeColor.primary }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dash',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionHistory}
        options={{
          tabBarLabel: 'Tx History',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "wallet" : "wallet-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddTransactions"
        component={AddTransaction}
        options={{
          tabBarLabel: 'Tx Add',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "plus-circle" : "plus-circle-outline"}
              color={focused ? themeColor.tertiary : color} // Change color based on focus state
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Budgets"
        component={Budgets}
        options={{
          tabBarLabel: 'Budgets',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "calendar" : "calendar-blank-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-settings" : "account-settings-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Make this component available to the app
export default MaterialBottomNavigation;
