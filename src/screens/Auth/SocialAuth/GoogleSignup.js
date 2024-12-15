import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import { handleSignupRequest } from '../signupService';
import { handleLoginRequest } from '../loginService';
import { useTheme } from '../../../themes/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import for responsive functions
import { rh, rw, rf } from '../../../themes/responsive'; // Assuming you have these functions

WebBrowser.maybeCompleteAuthSession();

const GoogleSignup = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { dispatch } = useContext(AppContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "393842026666-uag3f9i7ttpf79pblrd8bhc1s7i44hr2.apps.googleusercontent.com",
    androidClientId: "393842026666-tq7bl3ank3c2k36bud1s7b26vot500ep.apps.googleusercontent.com",
    webClientId: "393842026666-054pp672ijas3spo7in8kv39icheqbii.apps.googleusercontent.com",
    iosClientId: "393842026666-63fi024vj8m7fpo9cqq0g3ikosvor1pv.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      getUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  function generateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await res.json();
      setUser(userData);

      const password = generateRandomPassword();
      const response = await handleSignupRequest(userData.name, userData.email, password, "google");

      if (response.status === 201 && response.data.status === "success") {
        const responseLogin = await handleLoginRequest(userData.email, password, "social_login", dispatch);
        if (responseLogin) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'CashUp' }],
          });
        }
      } else if (response.status === 409 && response.data.status === "user_exists") {
        const responseLogin = await handleLoginRequest(userData.email, password, "social_login", dispatch);
        if (responseLogin) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'CashUp' }],
          });
        }
      } else if (response.data?.error) {
        setError(response.data.error);
        Alert.alert("Error", response.data.error);
      }
    } catch (error) {
      console.log('Unexpected Signup Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.socialContainer}>
      <TouchableOpacity
        disabled={!request || loading}
        onPress={() => promptAsync()}
        style={[styles.socialButton, { borderColor: theme.border }]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.text} />
        ) : (
          <>
            <MaterialCommunityIcons name="google" size={rw(5)} color={theme.text} />
            <Text style={[styles.socialButtonText, { color: theme.text }]}>Google</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  socialContainer: {
    marginTop: rh(1), // responsive margin-top
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rh(1.5), // responsive padding
    paddingHorizontal: rw(4), // responsive padding
    borderRadius: rw(2.5), // responsive border-radius
    borderWidth: 1,
  },
  socialButtonText: {
    fontSize: rf(2), // responsive font-size
    marginLeft: rw(2), // responsive margin-left
  },
});

export default GoogleSignup;
