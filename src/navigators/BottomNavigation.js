import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Dashboard from '../screens/DashboardScreen';
import Wallet from '../screens/Wallet/MyWalletScreen';
import { Alert, TouchableOpacity } from 'react-native';
import TransactionHistory from '../screens/Transaction/TransactionHistory';
import AddTransaction from '../screens/Transaction/AddTransaction';
import Budgets from '../screens/Budgets/budgets';
import Account from '../screens/Accounts';
import { useTheme } from '../themes/ThemeContext';
import { AppContext } from '../context/AppContext';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { rw, rh, rf } from '../themes/responsive';

const Tab = createBottomTabNavigator();

// Custom tab icon component
const CustomTabIcon = ({ name, focused, color, type = 'MaterialCommunityIcons' }) => {
  const IconComponent = type === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons;
  return <IconComponent name={name} color={color} size={rw(7)} />; // Icon size is now responsive
};

// Function to control the visibility of the tab bar
const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  return true;
};

const BottomNavigator = ({ route }) => {
  const { state, dispatch } = useContext(AppContext);
  const { theme } = useTheme();

  // Get visibility status based on the current focused route
  const isTabBarVisible = getTabBarVisibility(route);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let iconType = 'MaterialCommunityIcons';

          if (route.name === 'Home') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'AddTransactions') {
            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          } else if (route.name === 'Budgets') {
            iconName = focused ? 'calendar' : 'calendar-blank-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'account-settings' : 'account-settings-outline';
          }

          return <CustomTabIcon name={iconName} focused={focused} color={color} type={iconType} />;
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          display: isTabBarVisible ? 'flex' : 'none',
          backgroundColor: theme.primary,
          height: rh(10), // Responsive tab bar height
          paddingTop: rh(1), // Adjusted padding to ensure space for icons and text
          borderTopWidth: 0,
          paddingBottom: rh(1),
        },
        tabBarLabelStyle: { 
          fontSize: rf(1.5), // Responsive font size for label
          paddingBottom: rh(1.5), // Adjusted padding for label space
          fontWeight: 'bold', 
          textAlign: 'center', // Ensures label is centered below the icon
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.secondary,
          shadowColor: 'transparent',
        },
        headerTintColor: 'red',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.accent,
          textTransform: 'uppercase',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Dashboard} 
        options={{
          title: 'Dashboard', 
          tabBarLabel: 'Dash',
        }} 
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionHistory} 
        options={{
          title: 'Transactions History', 
          tabBarLabel: 'Tx History',
        }} 
      />
      <Tab.Screen 
        name="AddTransactions" 
        component={AddTransaction} 
        options={{
          title: 'Add Transactions',
          tabBarLabel: 'Tx Add',
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                dispatch({ type: 'SET_WALLET', payload: { walletId: null, walletName: null, walletImage: null } });
                dispatch({ type: 'SET_CATEGORY', payload: { categoryId: null, categoryName: null, categoryImage: null } });
                dispatch({  type: 'TRANSCTION_DATA',  payload: { transactionId: null, transactionAmount: null, transactionNote: null, transactionDate: null } });
                dispatch({ type: 'SET_CATEGORY_SELECT_TYPE', payload: null });
                props.onPress();
              }}
            />
          ),
        }} 
      />
      <Tab.Screen 
        name="Budgets" 
        component={Budgets} 
        options={{
          title: 'Budgets', 
          tabBarLabel: 'Budgets',
        }} 
      />
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
