import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Dashboard from '../screens/DashboardScreen';
import Wallet from '../screens/Wallet/MyWalletScreen';
import TransactionHistory from '../screens/Transaction/TransactionHistory';
import AddTransaction from '../screens/Transaction/AddTransaction';
import Budgets from '../screens/Budgets/budgets';
import Account from '../screens/Accounts';
import { useTheme } from '../themes/ThemeContext';
import { AppContext } from '../context/AppContext';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { rw, rh, rf } from '../themes/responsive';

const Tab = createBottomTabNavigator();

// Custom tab image component
const CustomTabImage = ({ focused, imagePathFill, imagePathOutline, width, height }) => {
  return (
    <Image
      source={focused ? imagePathFill : imagePathOutline}
      style={{
        width: rw(width), // Dynamic width
        height: rh(height), // Dynamic height
        resizeMode: 'contain',
      }}
    />
  );
};

// Function to control the visibility of the tab bar
const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  return true; // Adjust as per your logic
};

const BottomNavigator = ({ route }) => {
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  const isTabBarVisible = getTabBarVisibility(route);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let imagePathFill, imagePathOutline, iconWidth, iconHeight;

        // Assigning icon paths and custom sizes
        if (route.name === 'Home') {
          imagePathFill = require('../../assets/navigation-Icon/dashboard-fill.png');
          imagePathOutline = require('../../assets/navigation-Icon/dashboard-outline.png');
          iconWidth = 9.5; // Custom width for Home icon
          iconHeight = 9.5; // Custom height for Home icon
        } else if (route.name === 'Transactions') {
          imagePathFill = require('../../assets/navigation-Icon/wallet-fill.png');
          imagePathOutline = require('../../assets/navigation-Icon/wallet-outline.png');
          iconWidth = 8; // Custom width for Transactions icon
          iconHeight = 8; // Custom height for Transactions icon
        } else if (route.name === 'AddTransactions') {
          imagePathFill = require('../../assets/navigation-Icon/add-fill.png');
          imagePathOutline = require('../../assets/navigation-Icon/add-outline.png');
          iconWidth = 9; // Custom width for Add Transactions icon
          iconHeight = 9; // Custom height for Add Transactions icon
        } else if (route.name === 'Budgets') {
          imagePathFill = require('../../assets/navigation-Icon/user-fill.png');
          imagePathOutline = require('../../assets/navigation-Icon/user-outline.png');
          iconWidth = 6; // Custom width for Budgets icon
          iconHeight = 6; // Custom height for Budgets icon
        } else if (route.name === 'Account') {
          imagePathFill = require('../../assets/navigation-Icon/user-fill.png');
          imagePathOutline = require('../../assets/navigation-Icon/user-outline.png');
          iconWidth = 7.5; // Custom width for Account icon
          iconHeight = 7.5; // Custom height for Account icon
        }

        return {
          tabBarIcon: ({ focused }) => (
            <CustomTabImage
              focused={focused}
              imagePathFill={imagePathFill}
              imagePathOutline={imagePathOutline}
              width={iconWidth}
              height={iconHeight}
            />
          ),
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.text,
          tabBarStyle: {
            display: isTabBarVisible ? 'flex' : 'none',
            backgroundColor: theme.primary,
            height: rh(10),
            paddingTop: rh(1),
            borderTopWidth: 0,
            paddingBottom: rh(1),
          },
          tabBarLabelStyle: {
            fontSize: rf(1.5),
            paddingBottom: rh(1.5),
            fontWeight: 'bold',
            textAlign: 'center',
          },
          headerShown: false,
        };
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Dashboard} 
        options={{
          title: 'Dashboard', 
          tabBarLabel: 'Dashboard',
        }} 
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionHistory} 
        options={{
          title: 'Transactions History', 
          tabBarLabel: 'Transaction',
        }} 
      />
      {/* <Tab.Screen 
        name="AddTransactions" 
        component={AddTransaction} 
        options={{
          title: 'Add Transaction', 
          tabBarLabel: 'Add',
        }}
      /> */}
      {/* <Tab.Screen 
        name="Budgets" 
        component={Budgets} 
        options={{
          title: 'Budgets', 
          tabBarLabel: 'Budgets',
        }}
      /> */}
      <Tab.Screen 
        name="Account" 
        component={Account} 
        options={{
          title: 'Profile', 
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
