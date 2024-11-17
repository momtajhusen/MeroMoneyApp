import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../apiClient';

export const handleSignupRequest = async (name, email, password, method) => {
  try {
    const response = await apiClient.post('/register', {
      name,
      email,
      password,
      method
    });
    return response;
  } catch (error) {
    // Return the full error response, including custom fields like method
    return {
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};