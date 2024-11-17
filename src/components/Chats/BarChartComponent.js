// src/components/BarChartComponent.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const BarChartComponent = ({ data }) => {
    return (
        <View style={styles.chats}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Money Flow</Text>
            </View>
            <BarChart
                data={data}
                barWidth={30}
                noOfSections={5}
                barBorderRadius={5}
                maxValue={100}
                stepValue={25}
                frontColor="#d1e7ff"
                yAxisThickness={1}
                yAxisColor="#000"
                xAxisThickness={1}
                xAxisColor="#000"
                xAxisLabelTextStyle={{ color: '#333', fontSize: 12 }}
                yAxisTextStyle={{ color: '#333', fontSize: 12 }}
                showVerticalLines={true}
                verticalLinesColor="#eee"
                showHorizontalLines={true}
                horizontalLinesColor="#eee"
                roundedTop={true}
                showBarTops={true}
                barTopTextStyle={{ color: '#333', fontSize: 10 }}
                isAnimated={true}
                animationDuration={800}
            />
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
});

export default BarChartComponent;
