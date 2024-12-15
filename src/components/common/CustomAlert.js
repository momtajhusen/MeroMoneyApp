import React, { useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, StyleSheet, ScrollView, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rw, rh, rf } from '../../themes/responsive';

const CustomAlert = ({ visible, title, message, confirmText, onOk, onCancel, onConfirm, theme, type }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (callback) => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
    });
  };

  useEffect(() => {
    if (visible) {
      animateIn();
    }
  }, [visible]);

  // Back button handling
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        animateOut(onCancel);
        return true; // Prevent default back behavior
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible]);

  const handleCancel = () => {
    animateOut(onCancel);
  };

  const getIconName = () => {
    switch (type) {
      case 'error':
        return 'error-outline';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info-outline';
      case 'success':
        return 'done-all';
      case 'logout':
        return 'person-outline';
      default:
        return null;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'rgba(255, 76, 76, 0.5)';
      case 'warning':
        return 'rgba(255, 165, 0, 0.5)';
      case 'info':
        return 'rgba(30, 144, 255, 0.5)';
      case 'success':
        return 'rgba(50, 205, 50, 0.5)';
      case 'logout':
        return theme.accent;
      default:
        return theme.iconColor;
    }
  };

  const iconName = getIconName();
  const iconColor = getIconColor();

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.secondary, transform: [{ scale: scaleValue }] },
          ]}
        >
          {iconName && (
            <Icon name={iconName} size={rf(5)} color={iconColor} style={styles.icon} />
          )}
          <Text style={[styles.modalTitle, { color: theme.text }]}>{title}</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={[styles.modalMessage, { color: theme.text }]}>{message}</Text>
          </ScrollView>
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: theme.cancelButton, borderWidth: 1, borderColor: theme.border },
                ]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            )}
            {onOk && (
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: theme.cancelButton, borderWidth: 1, borderColor: theme.border },
                ]}
                onPress={onOk}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>OK</Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { backgroundColor: theme.confirmButton, borderWidth: 1, borderColor: theme.border },
                ]}
                onPress={() => animateOut(onConfirm)}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: rw(80),
    maxHeight: rh(50), // Fixed height for the modal
    padding: rh(2),
    borderRadius: rw(2.5),
    alignItems: 'center',
  },
  icon: {
    marginBottom: rh(1),
  },
  modalTitle: {
    fontSize: rf(2.5),
    fontWeight: 'bold',
    marginBottom: rh(1),
  },
  modalMessage: {
    fontSize: rf(2),
    textAlign: 'center',
    marginBottom: rh(2),
  },
  scrollView: {
    maxHeight: rh(20), // Restrict the message area height
    marginBottom: rh(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: rh(1.5),
    borderRadius: rw(1.25),
    marginRight: rw(1),
  },
  confirmButton: {
    flex: 1,
    paddingVertical: rh(1.5),
    borderRadius: rw(1.25),
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomAlert;
