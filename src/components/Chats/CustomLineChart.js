// Import libraries
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { useTheme } from '../../themes/ThemeContext';
import apiClient from '../../../apiClient';
import { useFocusEffect } from '@react-navigation/native';
import { rw, rh, rf } from '../../themes/responsive';

// Define the CustomLineChart component
const CustomLineChart = () => {
  const { theme } = useTheme();
  
  // State to hold income and expense data
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  
  // Fetch data from the API
  const fetchIncomeExpenseData = async () => {
    try {
      const response = await apiClient.get('/transactions-income-expense-data');

      if (response.status === 200) {
        const { income, expense } = response.data;
        
        if (Array.isArray(income) && Array.isArray(expense) && 
            income.every(i => typeof i === 'number') && 
            expense.every(e => typeof e === 'number')) {
          setIncomeData(income);
          setExpenseData(expense);
        } else {
          console.error('Invalid data structure:', response.data);
        }
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching income and expense data:', error);
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  // Use focus effect to fetch data when component is focused
  useFocusEffect(
    useCallback(() => {
      fetchIncomeExpenseData();
    }, [])
  );

  // Prepare data for the chart
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: incomeData.length > 0 ? incomeData : new Array(12).fill(0),
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity * 0.4})`,
        strokeWidth: 4,
      },
      {
        data: expenseData.length > 0 ? expenseData : new Array(12).fill(0),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity * 0.4})`,
        strokeWidth: 4,
      },
    ],
    legend: ["Income", "Expenses"],
  };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: theme.primary,
    backgroundGradientTo: theme.primary,
    color: (opacity = 1) => `${theme.accent}${Math.round(opacity * 255).toString(16)}`,
    labelColor: (opacity = 1) => `${theme.accent}${Math.round(opacity * 255).toString(16)}`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View
      style={{
        padding: rh(1),
        paddingLeft: rw(3),
        borderRadius: rw(2),
        backgroundColor: theme.secondary,
        marginTop: rh(1),
      }}
    >
      <Text
        style={{
          marginBottom: rh(1),
          marginLeft: rw(2),
          color: theme.text,
          fontSize: rf(2),
        }}
      >
        Report Current Year
      </Text>
      <LineChart
        data={data}
        width={rw(88)} // Responsive width using rw for almost full width
        height={rh(30)} // Responsive height using rh for chart height
        verticalLabelRotation={30}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: rw(2) }}
      />
    </View>
  );
};

// Export the component
export default CustomLineChart;
