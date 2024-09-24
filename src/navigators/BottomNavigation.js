import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Simple Bottom Tab Navigator
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Dashboard from '../screens/DashboardScreen';
import Wallet from '../screens/Wallet/MyWalletScreen';
import TransactionHistory from '../screens/Transaction/TransactionHistory';
import AddTransaction from '../screens/Transaction/AddTransaction';
import Budgets from '../screens/Budgets/budgets';
import Account from '../screens/Accounts';
import { lightTheme, darkTheme } from '../themes';  // Themes for color customization
import { AppContext } from '../context/AppContext';

const Tab = createBottomTabNavigator();  // Using simple Bottom Tab Navigator

// Create a custom tab icon component
const CustomTabIcon = ({ name, focused, color, type = 'MaterialCommunityIcons' }) => {
  const IconComponent = type === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons;
  return (
    <IconComponent
      name={name}
      color={color}
      size={30}
    />
  );
};

const BottomNavigator = () => {
  const { state } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme;  // Switch themes

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconType = 'MaterialCommunityIcons';  // Default icon type

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
        tabBarActiveTintColor: themeColor.accent,  // Active tab icon/text color
        tabBarInactiveTintColor: themeColor.text,  // Inactive tab icon/text color
        tabBarStyle: { 
          backgroundColor: themeColor.primary, 
          height: 80, 
          paddingTop: 10, 
          borderTopWidth: 0,  // Remove the top border
          borderWidth: 0 
        },
        tabBarLabelStyle: { fontSize: 12, paddingBottom: 20, fontWeight: 'bold' }, // Custom label styles
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Dashboard} 
        options={{
          title: 'Dash', 
          tabBarLabel: 'Dash',  // Custom label for bottom tab
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
