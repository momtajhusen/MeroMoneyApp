import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigators/StackNavigation';
import { AppProvider } from './src/context/AppContext';
import { PaperProvider } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import { ThemeProvider } from './src/themes/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';

// Prevent native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const App = () => {
  
  useEffect(() => {
    // Simulate an async task (like loading fonts) before hiding splash screen
    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      // Hide splash screen when ready
      SplashScreen.hideAsync();
    };
    prepare();
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
