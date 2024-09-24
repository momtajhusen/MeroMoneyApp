import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigator from './BottomNavigation';
import Splash from '../screens/SplashScreen';
import MaterialBottomNavigation from './MaterialBottomNavigation';
import Wallet from '../screens/Wallet/MyWalletScreen';
import SelectWallet from '../screens/Wallet/SelectWallet';
import AddWallets from '../screens/Wallet/AddWalletScreen';
import Currency from '../screens/Currency/Curency';
import NewCategory from '../screens/Category/newCategory';
import Categories from '../screens/Category/Categories';
import DeveloperMode from '../screens/Developer/developerMode';
import CurrencyUpload from '../screens/Developer/currencyUpload';
import SelectItonsTabs from '../screens/IconScreen/IconsTabs';
import IconUpload from '../screens/Developer/iconUpload';
import AllIcons from '../screens/Developer/AllIcons';
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';
import ParentExpensiveCategory from '../screens/Category/selectParentExpnsiveCategory';
import ParentIncomeCategory from '../screens/Category/selectParentIncomeCategory';
import Note from '../screens/Transaction/Note';
import ViewTransaction from '../screens/Transaction/ViewTransaction';
import UpdateTransaction from '../screens/Transaction/UpdateTransaction';
import { lightTheme, darkTheme } from '../themes';
import { AppContext } from '../context/AppContext';
import EditWallet from '../screens/Wallet/EditWallet';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const { state } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme; // Switch themes

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: themeColor.primary }, // Apply background color to all headers
        headerTitleStyle: { color: themeColor.text }, // Apply text color to all headers
        headerTintColor: themeColor.text, // Set the back button and icon color
      }}
    >
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="CashUp" component={BottomNavigator} options={{ title: 'मेरो MONEY' }} />
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Wallet" component={Wallet} options={{ title: 'My Wallets' }} />
      <Stack.Screen name="SelectWallet" component={SelectWallet} options={{ title: 'Select Wallet' }} />
      <Stack.Screen name="AddWallets" component={AddWallets} options={{ title: 'Add Wallets' }} />
      <Stack.Screen name="EditWallet" component={EditWallet} options={{ title: 'Edit Wallet' }} />
      <Stack.Screen name="Currency" component={Currency} options={{ title: 'Select Currency' }} />
      <Stack.Screen name="Categories" component={Categories} options={{ title: 'Categories' }} />
      <Stack.Screen name="NewCategory" component={NewCategory} options={{ title: 'Add New Category' }} />
      <Stack.Screen name="DeveloperMode" component={DeveloperMode} options={{ title: 'Developer Mode' }} />
      <Stack.Screen name="IconUpload" component={IconUpload} options={{ title: 'Icon Upload' }} />
      <Stack.Screen name="AllIcons" component={AllIcons} options={{ title: 'All Icons' }} />
      <Stack.Screen name="CurrencyUpload" component={CurrencyUpload} options={{ title: 'Currency Upload' }} />
      <Stack.Screen name="SelectItonsTabs" component={SelectItonsTabs} options={{ title: 'Select Icon' }} />
      <Stack.Screen name="ParentExpensiveCategory" component={ParentExpensiveCategory} options={{ title: 'Select Parent Category' }} />
      <Stack.Screen name="ParentIncomeCategory" component={ParentIncomeCategory} options={{ title: 'Select Parent Category' }} />
      <Stack.Screen name="Note" component={Note} options={{ title: 'Note' }} />
      <Stack.Screen name="ViewTransaction" component={ViewTransaction} options={{ title: 'View Transaction' }} />
      <Stack.Screen name="UpdateTransaction" component={UpdateTransaction} options={{ title: 'Update Transaction' }} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
