// src/components/Card.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ title, amount, percentage, positive }) => (
    <View style={styles.card}>
        <Text style={styles.cardText}>{title}</Text>
        <Text style={styles.amount}>{amount}</Text>
        <View style={styles.percentageContainer}>
            <Text
                style={[
                    styles.percentageText,
                    positive ? styles.positive : styles.negative,
                ]}
            >
                {percentage} %
            </Text>
            <Text style={styles.vsText}>vs last month</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 8,
    },
    cardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    percentageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    percentageText: {
        padding: 4,
        borderRadius: 4,
        fontSize: 13,
    },
    positive: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    negative: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
    vsText: {
        fontSize: 13,
        marginLeft: 8,
    },
});

export default Card;
