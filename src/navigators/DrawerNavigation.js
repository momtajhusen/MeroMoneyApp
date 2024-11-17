import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View,Text } from 'react-native';
import BottomNavigator from './BottomNavigation';
import Dashboard from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import WalletScreen from '../screens/Wallet/WalletScreen';
import GoalsScreen from '../screens/GoalsScreen';
import BudgetScreen from '../screens/BudgetScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
        <Drawer.Navigator
          screenOptions={{
            drawerPosition: 'left',
            gestureEnabled: true,
            edgeWidth: 1000,
          }}
        >
          <Drawer.Screen name="Dashboard" component={Dashboard} />
          <Drawer.Screen name="Transactions" component={TransactionsScreen} />
          <Drawer.Screen name="Wallet" component={WalletScreen} />
          <Drawer.Screen name="Goals" component={GoalsScreen} />
          <Drawer.Screen name="Budget" component={BudgetScreen} />
          <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>

 
 
    </View>
  );
};

export default DrawerNavigator;
