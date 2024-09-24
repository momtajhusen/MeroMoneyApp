import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigators/StackNavigation';
import { AppProvider } from './src/context/AppContext';
import { PaperProvider } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import BackgroundFetch from 'react-native-background-fetch';

const App = () => {
  useEffect(() => {
    // Background Fetch setup
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Fetch interval in minutes
        stopOnTerminate: false, // Continue after app is terminated
        startOnBoot: true, // Start after device reboot
      },
      async (taskId) => {
        console.log('[BackgroundFetch] taskId:', taskId);

        // Your background task code here (e.g. alarm logic)
        // Example: You can make an API call or perform some task
        console.log('Background fetch is running');

        // Call finish to signal completion
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.log('[BackgroundFetch] failed to start:', error);
      }
    );
  }, []);

  return (
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
  );
};

export default App;
