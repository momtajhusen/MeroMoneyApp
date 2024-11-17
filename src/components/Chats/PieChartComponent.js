// src/components/PieChartComponent.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const PieChartComponent = ({ data }) => {
    return (
        <View style={styles.chats}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Budget</Text>
            </View>
            <View style={styles.pieChartContainer}>
                <PieChart
                    data={data}
                    donut
                    showText={true}
                    textColor="#fff"
                    textSize={12}
                    isAnimated={true}
                    animationDuration={800}
                    radius={70}  // Reduced the radius from 100 to 80
                    innerCircleColor="#f5f5f5"
                    innerCircleRadius={60}  // Reduced the inner circle radius from 70 to 60
                />
                <View style={styles.pieChartLabels}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.pieChartLabel}>
                            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                            <Text style={styles.pieChartText}>{item.label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chats: {
        backgroundColor: '#fff',
        margin: 12,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chartHeader: {
        padding: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    pieChartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pieChartLabels: {
        flex: 1,
        paddingLeft: 16,
    },
    pieChartLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    colorBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 8,
    },
    pieChartText: {
        fontSize: 16,
        color: '#333',
    },
});

export default PieChartComponent;
