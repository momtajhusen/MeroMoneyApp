import React, { useRef, useEffect, useState, useContext } from 'react';
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
  TextInput
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
    categoryFilter: state.transactionFilter.categoryFilter,
    note: state.transactionFilter.note,
    amount: {
      min: state.transactionFilter.amount.min,
      max: state.transactionFilter.amount.max,
    },
  });

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
      type: 'SET_CATEGORY_FILTER',
      payload: filterValues.categoryFilter,
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
      categoryFilter: 'All',
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
      type: 'SET_CATEGORY_FILTER',
      payload: defaultValues.categoryFilter,
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

            <View>
              <Text style={{ color: theme.text, fontWeight: 'bold', marginBottom: 5 }}>Amount</Text>
              <Picker
                selectedValue={filterValues.amountFilterType}
                onValueChange={(value) => setFilterValues({ ...filterValues, amountFilterType: value })}
                className="p-0 m-0"
              >
                <Picker.Item  label="All" value="All" style={{color:theme.text, backgroundColor: theme.secondary}} />
                <Picker.Item label="Over" value="Over" style={{color:theme.text, backgroundColor: theme.secondary}} />
                <Picker.Item label="Under" value="Under" style={{color:theme.text, backgroundColor: theme.secondary}}  />
                <Picker.Item label="Between" value="Between" style={{color:theme.text, backgroundColor: theme.secondary}}  />
                <Picker.Item label="Exact" value="Exact" style={{color:theme.text, backgroundColor: theme.secondary}}  />
              </Picker>

              {filterValues.amountFilterType === 'Between' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <TextInput
                    style={[styles.input, {color:theme.text, borderColor:theme.border}]}
                    placeholder="Min Amount"
                    placeholderTextColor={theme.text}
                    keyboardType="numeric"
                    value={filterValues.amount.min}
                    onChangeText={(value) => setFilterValues({ ...filterValues, amount: { ...filterValues.amount, min: value } })}
                  />
                  <TextInput
                    style={[styles.input, {color:theme.text, borderColor:theme.border}]}
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
                <View style={styles.filterButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.walletFilterType === 'All' &&  {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, walletFilterType: 'All' })}
                  >
                    <Text style={styles.filterButtonText}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.walletFilterType === 'Over' && {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, walletFilterType: 'Over' })}
                  >
                    <Text style={styles.filterButtonText}>Over</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.walletFilterType === 'Under' && {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, walletFilterType: 'Under' })}
                  >
                    <Text style={styles.filterButtonText}>Under</Text>
                  </TouchableOpacity>
                </View>

                {/* Category Filter */}
                <Text style={{ color: theme.text, fontWeight: 'bold', marginTop: 10 }}>Category</Text>
                <View style={styles.filterButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.categoryFilter === 'All' && {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, categoryFilter: 'All' })}
                  >
                    <Text style={styles.filterButtonText}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.categoryFilter === 'Income' && {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, categoryFilter: 'Income' })}
                  >
                    <Text style={styles.filterButtonText}>Income</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterValues.categoryFilter === 'Expense' && {backgroundColor:theme.accent, borderColor:theme.border},
                    ]}
                    onPress={() => setFilterValues({ ...filterValues, categoryFilter: 'Expense' })}
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
    marginVertical: 5,
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