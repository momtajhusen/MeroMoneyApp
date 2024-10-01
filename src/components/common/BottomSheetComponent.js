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

import {Picker} from '@react-native-picker/picker';
import { useTheme } from '../../themes/ThemeContext';

import { AppContext } from '../../context/AppContext';

const screenHeight = Dimensions.get('window').height;

const CustomBottomSheet = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(visible);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const lastTranslateY = useRef(screenHeight).current;

  const { state, dispatch } = useContext(AppContext);

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
                selectedValue={state.transactionFilter.amountFilterType}
                onValueChange={(value) =>
                  dispatch({ type: 'SET_AMOUNT_FILTER', payload: { amountFilterType: value, amount: state.transactionFilter.amount } })
                }
                style={{backgroundColor:theme.secondary}}
                >
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Over" value="Over" />
                <Picker.Item label="Under" value="Under" />
                <Picker.Item label="Between" value="Between" />
                <Picker.Item label="Exact" value="Exact" />
              </Picker>
              
              {state.transactionFilter.amountFilterType === 'Between' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Min Amount"
                    keyboardType="numeric"
                    value={state.transactionFilter.amount.min}
                    onChangeText={(value) => dispatch({ type: 'SET_AMOUNT_FILTER', payload: { amountFilterType: 'Between', amount: { ...state.transactionFilter.amount, min: value } } })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Max Amount"
                    keyboardType="numeric"
                    value={state.transactionFilter.amount.max}
                    onChangeText={(value) => dispatch({ type: 'SET_AMOUNT_FILTER', payload: { amountFilterType: 'Between', amount: { ...state.transactionFilter.amount, max: value } } })}
                  />
                </View>
              )}

              <Text style={{ color: theme.text, fontWeight: 'bold', marginTop: 10 }}>Wallet</Text>
              <Picker
                selectedValue={state.transactionFilter.walletFilterType}
                onValueChange={(value) =>
                  dispatch({ type: 'SET_WALLET_FILTER', payload: { walletFilterType: value, wallet: state.transactionFilter.wallet } })
                }
                style={{backgroundColor:theme.secondary}}
                >
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Over" value="Over" />
                <Picker.Item label="Under" value="Under" />
                <Picker.Item label="Between" value="Between" />
                <Picker.Item label="Exact" value="Exact" />
              </Picker>
              
              <Text style={{ color: theme.text, fontWeight: 'bold', marginTop: 10 }}>Category</Text>
              <Picker
                selectedValue={state.transactionFilter.categoryFilter}
                onValueChange={(value) => dispatch({ type: 'SET_CATEGORY_FILTER', payload: value })}
                style={{backgroundColor:theme.secondary}}
              >
                <Picker.Item label="All Categories" value="All" />
                <Picker.Item label="All Income" value="Income" />
                <Picker.Item label="All Expenses" value="Expense" />
              </Picker>
              
              {/* <Text style={{ color: theme.text, fontWeight: 'bold', marginTop: 10 }}>Note</Text>
              <TextInput
                style={[styles.input, {backgroundColor:theme.secondary}]}
                placeholder="Enter note"
                value={state.transactionFilter.note}
                onChangeText={(text) => dispatch({ type: 'SET_NOTE_FILTER', payload: text })}
              /> */}
            </View>



          </View>
          <TouchableOpacity>
              <SaveButton title="Apply" />
          </TouchableOpacity>
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
    bottom: 0,
    width: '100%',
    height: '70%', // Adjust height as needed
    padding: 16,

  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  draggableIconContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  draggableIcon: {
    width: 40,
    height: 5,
    borderRadius: 2,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'start',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginTop: 5,
    marginBottom: 10,
  }
});

export default CustomBottomSheet;