import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigator from './BottomNavigation';
import Splash from '../screens/SplashScreen';
import { View, Text, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Wallet from '../screens/Wallet/MyWalletScreen';
import SelectWallet from '../screens/Wallet/SelectWallet';
import AddWallets from '../screens/Wallet/AddWalletScreen';
import Currency from '../screens/Currency/Curency';
import NewCategory from '../screens/Category/newCategory';
import UpdateCategory from '../screens/Category/updateCategory';
import Categories from '../screens/Category/Categories';
import DeveloperMode from '../screens/Developer/developerMode';
import CurrencyUpload from '../screens/Developer/currencyUpload';
import SelectItonsTabs from '../screens/IconScreen/IconsTabs';
import IconUpload from '../screens/Developer/iconUpload';
import IconUpdate from '../screens/Developer/IconUpdate';
import AllIcons from '../screens/Developer/AllIcons';
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';
import ParentExpensiveCategory from '../screens/Category/selectParentExpnsiveCategory';
import ParentIncomeCategory from '../screens/Category/selectParentIncomeCategory';
import Note from '../screens/Transaction/Note';
import ViewTransaction from '../screens/Transaction/ViewTransaction';
import UpdateTransaction from '../screens/Transaction/UpdateTransaction';
import { useTheme } from '../themes/ThemeContext';
import { AppContext } from '../context/AppContext';
import EditWallet from '../screens/Wallet/EditWallet';
import Settings from '../screens/SettingsScreen';
import ThemsSelect from '../themes/themsSelect';
import Hello from '../screens/Auth/Hello';
import IntroScreen from '../screens/Auth/IntroScreen';
import { TouchableOpacity } from 'react-native';
import Notification from '../screens/Notification';
import { useNavigation } from '@react-navigation/native';
import BiometricLogin from '../screens/Auth/ExpoBiometricAuth';
import ForgetEmail from '../screens/Auth/Forget/ForgetEmail';
import VerifiyCode from '../screens/Auth/Forget/VerifyCode';
import EnterNewPassword from '../screens/Auth/Forget/EnterNewPassword';
import PasswordChangeSucess from '../screens/Auth/Forget/PasswordChangeSucess';
import PrivacyPolicyScreen from '../screens/Auth/PrivacyPolicyScreen';
import TermsAndConditionsScreen from '../screens/Auth/TermsAndConditionsScreen';
import OldPasswordChange from '../screens/Auth/Forget/OldPasswordChange';
import AddTransaction from '../screens/Transaction/AddTransaction';
import { rw, rh, rf } from '../themes/responsive';
import BalanceTransfer from '../screens/Wallet/BalanceTransfer';
import BalanceAdjustment from '../screens/Wallet/BalanceAdjustment';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const { state } = useContext(AppContext);
  const { theme } = useTheme();
  const navigation = useNavigation();

  const HeaderTitle = () => {
    return (
      <View style={{ width: rw(92), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/logo.png')} style={{ width: rw(9), height: rw(8) }} />
          <Text style={{ fontFamily: 'Rowdies-Bold', letterSpacing: 2,  color: theme.text, fontSize: rf(2.3), marginLeft: rw(2), fontWeight: 'bold' }}>
            PaYd
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <MaterialIcons name='notifications' size={rf(2.7)} color={theme.text} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.secondary },
        headerTitleStyle: { color: theme.text },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="IntroScreen" component={IntroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Hello" component={Hello} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="BiometricLogin" component={BiometricLogin} options={{ headerShown: false }} />

      <Stack.Screen name="ForgetEmail" component={ForgetEmail} options={{ headerShown: false }} />
      <Stack.Screen name="VerifiyCode" component={VerifiyCode} options={{ headerShown: false }} />
      <Stack.Screen name="EnterNewPassword" component={EnterNewPassword} options={{ headerShown: false }} />
      <Stack.Screen name="PasswordChangeSucess" component={PasswordChangeSucess} options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OldPasswordChange" component={OldPasswordChange} options={{ headerShown: false }} />

      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="CashUp" component={BottomNavigator} options={{
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
        }} />
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="AddTransaction" component={AddTransaction} options={{ title: 'Add Transaction'  }} />
      <Stack.Screen name="Wallet" component={Wallet} options={{ title: 'My Wallets' }} />
      <Stack.Screen name="SelectWallet" component={SelectWallet} options={{ title: 'Select Wallet' }} />
      <Stack.Screen name="AddWallets" component={AddWallets} options={{ title: 'Add Wallets' }} />
      <Stack.Screen name="EditWallet" component={EditWallet} options={{ title: 'Edit Wallet' }} />
      <Stack.Screen name="Currency" component={Currency} options={{ title: 'Select Currency' }} />
      <Stack.Screen name="Categories" component={Categories} options={{ title: 'Categories' }} />
      <Stack.Screen name="NewCategory" component={NewCategory} options={{ title: 'Add New Category' }} />
      <Stack.Screen name="UpdateCategory" component={UpdateCategory} options={{ title: 'Update Category' }} />
      <Stack.Screen name="DeveloperMode" component={DeveloperMode} options={{ title: 'Developer Mode' }} />
      <Stack.Screen name="IconUpload" component={IconUpload} options={{ title: 'Icon Upload' }} />
      <Stack.Screen name="IconUpdate" component={IconUpdate} options={{ title: 'Icon Update' }} />
      <Stack.Screen name="AllIcons" component={AllIcons} options={{ title: 'All Icons' }} />
      <Stack.Screen name="CurrencyUpload" component={CurrencyUpload} options={{ title: 'Currency Upload' }} />
      <Stack.Screen name="SelectItonsTabs" component={SelectItonsTabs} options={{ title: 'Select Icon' }} />
      <Stack.Screen name="ParentExpensiveCategory" component={ParentExpensiveCategory} options={{ title: 'Select Parent Category' }} />
      <Stack.Screen name="ParentIncomeCategory" component={ParentIncomeCategory} options={{ title: 'Select Parent Category' }} />
      <Stack.Screen name="Note" component={Note} options={{ title: 'Note' }} />
      <Stack.Screen name="ViewTransaction" component={ViewTransaction} options={{ title: 'View Transaction' }} />
      <Stack.Screen name="UpdateTransaction" component={UpdateTransaction} options={{ title: 'Update Transaction' }} />
      <Stack.Screen name="Settings" component={Settings} options={{ title: 'Update Transaction' }} />
      <Stack.Screen name="ThemesSelect" component={ThemsSelect} options={{ title: 'Themes' }} />
      <Stack.Screen name="Notification" component={Notification} options={{ title: 'Notifications' }} />  
      <Stack.Screen name="BalanceTransfer" component={BalanceTransfer} options={{ title: 'Balance Transfer' }} />  
      <Stack.Screen name="BalanceAdjustment" component={BalanceAdjustment} options={{ title: 'Balance Adjustment' }} />  


      

      
    </Stack.Navigator>
  );
};

export default StackNavigation;
