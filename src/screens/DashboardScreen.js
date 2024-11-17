// Import necessary modules
import React, { useContext, useState } from 'react';
import { View, FlatList, RefreshControl, Text, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext'; // Import your context
import { useTheme } from '../themes/ThemeContext';
import CustomLineChart from '../components/Chats/CustomLineChart';
import TotalBalanceWithWallets from './Dashboard/TotalBalanceWithWallets';
import TopSpending from './Dashboard/TopSpending';
import { rw, rh, rf } from '../themes/responsive'; // Responsive utilities


const Dashboard = () => {
  const { state, dispatch } = useContext(AppContext); // Access dispatch from context
  const { theme } = useTheme(); // Access theme

  // State for refresh control
  const [refreshing, setRefreshing] = useState(false);

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    // Dispatch the SET_REFRESH action with a random payload to toggle state
    dispatch({ type: 'SET_REFRESH', payload: Math.random() });

    // Here you can perform actions to refresh your data (fetch new data, etc.)
    setRefreshing(false);
  };

  // Data for the FlatList (including the components)
  const dashboardData = [
    { id: '1', component: <TotalBalanceWithWallets /> },
    { id: '2', component: <CustomLineChart /> },
    { id: '3', component: <TopSpending /> },
  ];

  const renderItem = ({ item }) => (
    <View>
      {item.component}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <FlatList
        data={dashboardData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

// Define styles for responsiveness
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: rw(3), // Responsive padding for container
  },
  contentContainer: {
    paddingVertical: rh(1), // Responsive vertical padding
    backgroundColor: 'transparent', // Ensure it matches the theme's background color
  },
});

export default Dashboard;
