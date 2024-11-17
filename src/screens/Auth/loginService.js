// loginService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../apiClient';

export const handleLoginRequest = async (email, password, method, dispatch) => {
  try {
    const response = await apiClient.post('/login', { email, password, method });

    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('hasSeenIntro', 'true');
      const biometricAuthData = {
        email,
        password,
        method,
        Auth: true,
      };
      await AsyncStorage.setItem('BiometricAuth', JSON.stringify(biometricAuthData));

      dispatch({
        type: 'SET_USER',
        payload: {
          userId: response.data.user.id,
          userRole: response.data.user.role,
          userEmail: response.data.user.email,
          userName: response.data.user.name,
        },
      });

      return { data: response.data };
    }
  } catch (error) {
    // Return the structured error response, similar to handleSignupRequest
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Something went wrong. Please try again.' },
      method, // Including the method for consistency
    };
  }
};
