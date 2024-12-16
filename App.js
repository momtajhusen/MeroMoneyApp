import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigators/StackNavigation';
import { AppProvider } from './src/context/AppContext';
import { PaperProvider } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import { ThemeProvider } from './src/themes/ThemeContext'; // Ensure path is correct
import * as SplashScreen from 'expo-splash-screen';

const App = () => {
  useEffect(() => {
    // Prevent the splash screen from hiding automatically
    SplashScreen.preventAutoHideAsync();
    
    // Simulate loading process or any other initialization here
    setTimeout(() => {
      // Hide splash screen after app is ready
      SplashScreen.hideAsync();
    }, 100);  
  }, []);

  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <MenuProvider>
          <PaperProvider>
            <AppProvider>
              <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor="black" />
                <StackNavigation />
              </NavigationContainer>
            </AppProvider>
          </PaperProvider>
        </MenuProvider>
      </View>
    </ThemeProvider>
  );
};

export default App;
