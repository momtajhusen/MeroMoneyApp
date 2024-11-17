import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListItems from '../components/common/List';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../themes/ThemeContext';
import CustomAlert from '../components/common/CustomAlert';
import { rw, rh, rf } from '../themes/responsive';

const Account = () => {
   const navigation = useNavigation();
   const { state, dispatch } = useContext(AppContext);
   const { theme } = useTheme();
   const [isModalVisible, setModalVisible] = useState(false);

   const email = state.userEmail;

   const handleLogout = async () => {
      try {
         await AsyncStorage.removeItem('authToken');
         dispatch({ type: 'RESET_STATE' });
         navigation.replace('Hello');
         setModalVisible(false); // Close the modal after logging out
      } catch (error) {
         console.log('Error removing authToken:', error);
      }
   };

   useEffect(() => {
      const checkAuthToken = async () => {
         const token = await AsyncStorage.getItem('authToken');
         if (token !== null) {
            console.log(token);
         }
      };
      checkAuthToken();
   }, [navigation]);

   return (
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
         <View style={[styles.profileContainer, { borderColor: theme.border }]}>
            <Image
               source={{ uri: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" }}
               style={styles.profileImage}
               resizeMode="contain"
            />
            <View style={styles.profileDetails}>
               <Text style={[styles.userName, { color: theme.text }]}>{state.userName}</Text>
               <Text style={[styles.userEmail, { color: theme.text }]}>{state.userEmail}</Text>
               {state.userRole === 'developer' && (
                  <Text style={[styles.userRole, { color: theme.text }]}>Role: {state.userRole}</Text>
               )}
            </View>
         </View>

         <ListItems 
            icon="account-balance-wallet" 
            title="My Wallets" 
            onPress={() => navigation.navigate('Wallet')}
         />
         <ListItems 
            icon="category" 
            title="Category" 
            onPress={() => navigation.navigate('Categories')}
         />
         <ListItems 
            icon="interests" 
            title="Icons" 
            onPress={() => navigation.navigate('AllIcons')}
         />
         <ListItems 
            icon="palette" 
            title="Theme" 
            onPress={() => navigation.navigate('ThemesSelect')}
         />
         <ListItems 
            icon="password" 
            title="Change Password" 
            onPress={() => navigation.navigate('OldPasswordChange')}
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
            title="Log out" 
            onPress={() => setModalVisible(true)} // Show the modal on press
         />

         {/* Use the CustomAlert component for logout confirmation */}
         <CustomAlert
            visible={isModalVisible}
            title="Account Logout"
            message="Are you sure you want to log out?"
            confirmText="Logout"
            onCancel={() => setModalVisible(false)}
            onConfirm={handleLogout}
            type="logout"
            theme={theme} // Pass the theme to customize the alert
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: rw(4), // Adjusted padding for responsiveness
   },
   profileContainer: {
      padding: rw(4),
      marginBottom: rh(2),
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
   },
   profileImage: {
      width: rw(12), // Adjusted width for responsiveness
      height: rw(12), // Adjusted height for responsiveness
      borderRadius: rw(6), // Adjusted border radius for circular image
      marginBottom: rh(2),
   },
   profileDetails: {
      alignItems: 'center',
   },
   userName: {
      fontSize: rf(3.2), // Adjusted font size for responsiveness
      fontWeight: 'bold',
   },
   userEmail: {
      fontSize: rf(2.2), // Adjusted font size for responsiveness
      marginBottom: rh(1),
   },
   userRole: {
      fontSize: rf(2.2), // Adjusted font size for responsiveness
      fontWeight: 'bold',
   },
});

export default Account;
