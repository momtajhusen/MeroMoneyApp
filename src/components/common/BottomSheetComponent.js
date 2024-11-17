 import React, { useRef, useEffect, useState, useContext } from 'react';
 import apiClient from '../../../apiClient';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  PanResponder,
  TextInput,
  ScrollView
} from 'react-native';

import SaveButton from '../SaveButton';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../themes/ThemeContext';
import { AppContext } from '../../context/AppContext';

const screenHeight = Dimensions.get('window').height;

const CustomBottomSheet = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(visible);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const lastTranslateY = useRef(screenHeight).current;

  const { state, dispatch } = useContext(AppContext);

  // Create local state for filter values
  const [filterValues, setFilterValues] = useState({
    amountFilterType: state.transactionFilter.amountFilterType,
    walletFilterType: state.transactionFilter.walletFilterType,
    transactionType: state.transactionFilter.transactionType,
    note: state.transactionFilter.note,
    amount: {
      min: state.transactionFilter.amount.min,
      max: state.transactionFilter.amount.max,
    },
  });

  const [walletTypes, setWalletTypes] = useState([]);


  const fetchWalletTypes = async () => {
    try {
      // Replace with actual API call
      const response = await apiClient.get('/wallets');
      console.log(response.data);

      // Extract 'name' from the response data and set it in state
      const walletNames = ['All', ...response.data.map(wallet => wallet.name)];
      setWalletTypes(walletNames); // Update state with wallet names

    } catch (error) {
      console.error('Error fetching wallet types:', error);
      setWalletTypes(['All', 'eSewa', 'Under']); // Fallback data
    }
  };


  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowModal(false));
    }
    fetchWalletTypes();
  }, [visible, translateY]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newY = gestureState.dy + lastTranslateY;
        if (newY < screenHeight && newY > 0) {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const applyFilters = () => {
    dispatch({
      type: 'SET_AMOUNT_FILTER',
      payload: {
        amountFilterType: filterValues.amountFilterType,
        amount: filterValues.amount,
      },
    });
    dispatch({
      type: 'SET_WALLET_FILTER',
      payload: {
        walletFilterType: filterValues.walletFilterType,
        wallet: state.transactionFilter.wallet,
      },
    });
    dispatch({
      type: 'SET_TRANSACTION_TYPE_FILTER',
      payload: filterValues.transactionType,
    });
    dispatch({
      type: 'SET_NOTE_FILTER',
      payload: filterValues.note,
    });

    handleClose(); // Close the modal after applying filters
  };

  const clearFilters = () => {
    const defaultValues = {
      amountFilterType: 'All',
      walletFilterType: 'All',
      transactionType: 'All',
      note: '',
      amount: {
        min: '',
        max: '',
      },
    };

    // Reset the filter values to default
    setFilterValues(defaultValues);
    
    // Apply the default filter values
    dispatch({
      type: 'SET_AMOUNT_FILTER',
      payload: {
        amountFilterType: defaultValues.amountFilterType,
        amount: defaultValues.amount,
      },
    });
    dispatch({
      type: 'SET_WALLET_FILTER',
      payload: {
        walletFilterType: defaultValues.walletFilterType,
        wallet: state.transactionFilter.wallet,
      },
    });
    dispatch({
      type: 'SET_TRANSACTION_TYPE_FILTER',
      payload: defaultValues.transactionType,
    });
    dispatch({
      type: 'SET_NOTE_FILTER',
      payload: defaultValues.note,
    });

    handleClose(); // Close the modal after clearing filters
  };

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderColor: theme.border,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
          },
        ]}
        {...panResponder.panHandlers} // Add panHandlers to the Animated.View
      >
        <View style={styles.content}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.draggableIconContainer}>
            <View
              style={[
                styles.draggableIcon,
                { backgroundColor: theme.accent },
              ]}
            />
          </View>
          <View className="flex-1">
            <Text style={[styles.sheetTitle, { color: theme.text }]}>
              Filter Transaction
            </Text>

            <View className="flex-1">
              <Text style={{ color: theme.text, fontWeight: 'bold', marginBottom: 5 }}>Amount</Text>
              <Picker
              selectedValue={filterValues.amountFilterType}
              onValueChange={(value) => setFilterValues({ ...filterValues, amountFilterType: value })}
              style={{
                height: 50, // Adjust the height of the Picker
                width: '100%', // Full width of the container
                borderColor: theme.primary, // Set border color based on your theme
                borderWidth: 1, // Set the border width
                borderRadius: 8, // Optional, for rounded corners
                backgroundColor: theme.secondary, // Background color of the Picker
                paddingLeft: 10, // Add some padding inside
              }}
            >
              <Picker.Item
                label="All"
                value="All"
                style={{
                  color: theme.text, // Text color
                  backgroundColor: theme.secondary, // Background color for the selected item
                }}
              />
              <Picker.Item
                label="Over"
                value="Over"
                style={{
                  color: theme.text,
                  backgroundColor: theme.secondary,
                }}
              />
              <Picker.Item
                label="Under"
                value="Under"
                style={{
                  color: theme.text,
                  backgroundColor: theme.secondary,
                }}
              />
              <Picker.Item
                label="Between"
                value="Between"
                style={{
                  color: theme.text,
                  backgroundColor: theme.secondary,
                }}
              />
              <Picker.Item
                label="Exact"
                value="Exact"
                style={{
                  color: theme.text,
                  backgroundColor: theme.secondary,
                }}
              />
            </Picker>


              {/* Filters for specific amount values */}
              {filterValues.amountFilterType === 'Over' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.accent }]}
                  placeholder="Amount Over"
                  placeholderTextColor={theme.text}
                  keyboardType="numeric"
                  value={filterValues.amount.min}
                  onChangeText={(value) => setFilterValues({ ...filterValues, amount: { ...filterValues.amount, min: value } })}
                />
                </View>
              )}

              {filterValues.amountFilterType === 'Under' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.accent }]}
                  placeholder="Amount Under"
                  placeholderTextColor={theme.text}
                  keyboardType="numeric"
                  value={filterValues.amount.max}
                  onChangeText={(value) => setFilterValues({ ...filterValues, amount: { ...filterValues.amount, max: value } })}
                />
                </View>
              )}

              {filterValues.amountFilterType === 'Exact' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.accent }]}
                  placeholder="Exact Amount"
                  placeholderTextColor={theme.text}
                  keyboardType="numeric"
                  value={filterValues.amount.min}
                  onChangeText={(value) => setFilterValues({ ...filterValues, amount: { ...filterValues.amount, min: value } })}
                />
                </View>
              )}

              {filterValues.amountFilterType === 'Between' && (
                <View className="space-x-3" style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.accent }]}
                    placeholder="Min Amount"
                    placeholderTextColor={theme.text}
                    keyboardType="numeric"
                    value={filterValues.amount.min}
                    onChangeText={(value) => setFilterValues({ ...filterValues, amount: { ...filterValues.amount, min: value } })}
                  />
                  <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.accent }]}
                    placeholder="Max Amount"
                    placeholderTextColor={theme.text}
                    keyboardType="numeric"
                    value={filterValues.amount.max}
                    onChangeText={(value) => setFilterValues({ ...filterValues, amount: { ...filterValues.amount, max: value } })}
                  />
                </View>
              )}

              <View>
                {/* Wallet Filter */}
                <Text style={{ color: theme.text, fontWeight: 'bold', marginTop: 10 }}>Wallet</Text>
                <ScrollView horizontal={true} style={styles.scrollView}>
                  <View className="space-x-4 ml-5" style={styles.filterButtonContainer}>
                    {walletTypes.map((walletType, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.filterButton,
                          filterValues.walletFilterType === walletType && {
                            backgroundColor: theme.accent,
                            borderColor: theme.border,
                          },
                        ]}
                        onPress={() => setFilterValues({ ...filterValues, walletFilterType: walletType })}
                      >
                        <Text style={styles.filterButtonText}>{walletType}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Category Filter */}
                <Text style={{ color: theme.text, fontWeight: 'bold', marginTop: 10 }}>Transaction Type</Text>
                <View style={styles.filterButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.transactionType === 'All' && {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, transactionType: 'All' })}
                  >
                    <Text style={styles.filterButtonText}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.transactionType === 'Income' && {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, transactionType: 'Income' })}
                  >
                    <Text style={styles.filterButtonText}>Income</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.transactionType === 'Expense' && {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, transactionType: 'Expense' })}
                  >
                    <Text style={styles.filterButtonText}>Expense</Text>
                  </TouchableOpacity>
                </View>
              </View>


              <Text style={{ color: theme.text, fontWeight: 'bold', marginTop: 10 }}>Note</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <TextInput
                    style={[styles.input, {color:theme.text, borderColor:theme.border}]}
                    placeholder="Enter note"
                    placeholderTextColor={theme.text}
                    value={filterValues.note}
                    onChangeText={(text) => setFilterValues({ ...filterValues, note: text })}
                  />
                </View>

            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={clearFilters} style={styles.button}>
              <SaveButton title="Clear" />
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilters} style={styles.button}>
              <SaveButton title="Apply" />
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '80%',
    overflow:'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  draggableIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  draggableIcon: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 0,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },

  filterButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  filterButton: {
    borderColor: '#F0AD4E',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  
  filterButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CustomBottomSheet;