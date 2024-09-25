// Import necessary libraries
import React,{useEffect, useContext} from 'react';
import { View, Alert, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListItems from '../components/common/List';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../themes/ThemeContext';

// Create the Account component
const Account = () => {
   const navigation = useNavigation();

   const { state, dispatch } = useContext(AppContext);
   const { theme } = useTheme();

   console.log(useTheme);

   // Logout function with confirmation alert
   const handleLogout = () => {
      Alert.alert(
         "Logout",
         "Are you sure you want to log out?",
         [
            {
               text: "Cancel",
               style: "cancel"
            },
            {
               text: "OK", 
               onPress: async () => {
                  try {
                     // Remove authToken from AsyncStorage
                     await AsyncStorage.removeItem('authToken');

                     dispatch({
                        type: 'SET_USER',
                        payload: {
                          userId: null,
                          userRole: null,
                          userEmail: null,
                          userName: null,
                        }
                      });

                     // Navigate to login screen
                     navigation.navigate('Login'); // Replace 'Login' with your actual login screen
                  } catch (error) {
                     console.log('Error removing authToken:', error);
                  }
               }
            }
         ]
      );
   };


   useEffect(() => {
       const checkAuthToken = async () => {
 
        const token = await AsyncStorage.getItem('authToken');

            if (token !== null) {
               console.log(token);
            }
      
          }
        checkAuthToken();
    }, [navigation]);

   return (
      <View className="p-4 flex-1" style={{backgroundColor: theme.primary}}>
         <View className="p-5 mb-5 items-center space-y-2" style={{borderWidth:1, borderColor:theme.border, borderRadius:8}}>
               <Image 
                  source={{ uri: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" }}
                  style={{ width: 50, height: 50 }} 
                  resizeMode="contain"
               />
               <View className="items-center">
                  <Text className="font-bold" style={{color:theme.text, fontSize:20}}>{state.userName}</Text>
                  <Text className="font-bold" style={{color:theme.text}}>{state.userEmail}</Text>
                  { state.userRole === 'developer' && (
                    <Text className="font-bold" style={{color:theme.text}}>Role : {state.userRole}</Text>
                  )}
               </View>

         </View>
         <ListItems 
            icon="account-balance-wallet" 
            title="My Wallets" 
            onPress={() => navigation.navigate('Wallet')}
            style={{backgroundColor:'red'}}
         />
         <ListItems 
            icon="category" 
            title="Category" 
            onPress={() => navigation.navigate('Categories')}
         />
         <ListItems 
            icon="palette" 
            title="Theme" 
            onPress={() => navigation.navigate('ThemsSelect')}
         />
        {state.userRole === 'developer' && (
            <ListItems
               icon="developer-mode"
               title="Developer Mode"
               onPress={() => navigation.navigate('DeveloperMode')}
            />
         )}
         <ListItems 
            icon="logout" 
            title="LogOut" 
            onPress={handleLogout} // Attach logout handler
         />
      </View>
   );
};
 

// Export the Account component
export default Account;
