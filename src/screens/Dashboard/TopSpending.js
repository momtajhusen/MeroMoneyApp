// Import libraries
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../../apiClient'; 
import { useTheme } from '../../themes/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { rw, rh, rf } from '../../themes/responsive';

const TopSpending = () => {
  const { state } = useContext(AppContext);
  const { theme } = useTheme();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  const fetchTopSpendingTransactions = async () => {
    // setLoading(true);
    try {
      const response = await apiClient.get('/top-spending-transactions');
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const onRefresh = () => {
    setRefreshing(true);
    fetchTopSpendingTransactions().then(() => setRefreshing(false));
  };

    // Use focus effect to fetch data when component is focused
    useFocusEffect(
      useCallback(() => {
        fetchTopSpendingTransactions();
      }, [])
    );

  const renderItem = ({ item }) => (
    <View
      style={{
        padding: rh(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.primary,
        marginBottom: rh(0.5),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {item.icon_path ? (
          <Image
            source={{ uri: BASE_URL + item.icon_path }}
            style={{
              width: rw(7.5),
              height: rw(7.5),
              borderRadius: rw(1),
            }}
          />
        ) : (
          <MaterialIcons name="attach-money" size={rf(3)} color={theme.text} />
        )}
        <Text style={{ color: theme.text, marginLeft: rw(2), fontSize: rf(2) }}>
          {item.category_name}
        </Text>
      </View>
      <Text style={{ fontWeight: 'bold', color: theme.text, fontSize: rf(2) }}>
        {parseFloat(item.percentage).toFixed(2)}%
      </Text>
    </View>
  );

  return (
    <View
      style={{
        padding: rh(1.5),
        borderRadius: rw(2),
        backgroundColor: theme.secondary,
        marginTop: rh(1),
      }}
    >
      <Text style={{ marginBottom: rh(1), color: theme.text, fontSize: rf(2) }}>
        Top Spending
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.parent_id ? item.parent_id.toString() : Math.random().toString()
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: rh(2) }}
        />
      )}
    </View>
  );
};

export default TopSpending;
