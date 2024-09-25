// Import libraries
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import apiClient from '../../../apiClient'; // Adjust the import path as necessary
import { useTheme } from '../../themes/ThemeContext';

// Define the Signup component
const Signup = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { theme } = useTheme();

    // Function to handle form submission
    const handleSignup = async () => {
        try {
            const response = await apiClient.post('/register', {
                name,
                email,
                password,
            });
    
            console.log(response.data);
    
            if (response.data.token && response.data.user) {
                Alert.alert('Success', 'Account created successfully!');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', 'Unexpected response format');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.response?.data?.error || 'An error occurred');
        }
    };
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Signup</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Sign Up" onPress={handleSignup} />
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default Signup;
