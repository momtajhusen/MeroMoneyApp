import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigators/StackNavigation';
import { AppProvider } from './src/context/AppContext';
import { PaperProvider } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import { ThemeProvider } from './src/themes/ThemeContext';
const App = () => {
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
