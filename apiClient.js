// apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'https://finance.scriptqube.com/api',
});

// Intercept requests to add token to headers
apiClient.interceptors.request.use(
  async (config) => {
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('authToken');

    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
