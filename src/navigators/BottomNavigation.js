import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Dashboard from '../screens/DashboardScreen';
import Wallet from '../screens/Wallet/MyWalletScreen';
import TransactionHistory from '../screens/Transaction/TransactionHistory';
import AddTransaction from '../screens/Transaction/AddTransaction';
import Budgets from '../screens/Budgets/budgets';
import Account from '../screens/Accounts';
import  { useTheme } from '../themes/ThemeContext';
import { AppContext } from '../context/AppContext';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// Custom tab icon component
const CustomTabIcon = ({ name, focused, color, type = 'MaterialCommunityIcons' }) => {
  const IconComponent = type === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons;
  return <IconComponent name={name} color={color} size={30} />;
};

// Function to control the visibility of the tab bar
const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  // Hide the tab bar if the current screen is 'Account'
  if (routeName === 'Account') {
    return false;
  }
  return true;
};

const BottomNavigator = ({ route }) => {
  const { state } = useContext(AppContext);
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
          display: isTabBarVisible ? 'flex' : 'none', // Conditionally hide/show tab bar
          backgroundColor: theme.primary,
          height: 80,
          paddingTop: 10,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: { fontSize: 12, paddingBottom: 20, fontWeight: 'bold' },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Dashboard} 
        options={{
          title: 'Dash', 
          tabBarLabel: 'Dash',
        }} 
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionHistory} 
        options={{
          title: 'Tx History', 
          tabBarLabel: 'Tx History',
        }} 
      />
      <Tab.Screen 
        name="AddTransactions" 
        component={AddTransaction} 
        options={{
          title: 'Tx Add',
          tabBarLabel: 'Tx Add',
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
