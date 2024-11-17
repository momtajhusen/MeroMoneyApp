import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useTheme } from '../themes/ThemeContext';
import { rw, rh, rf } from '../themes/responsive';

const SaveButton = ({ onPress, loading, disabled, title = "Save" }) => {
  const { theme } = useTheme();

  return (
    <TouchableRipple
      onPress={!loading && !disabled ? onPress : null}
      rippleColor="rgba(0, 0, 0, .32)"
      style={[
        styles.saveButton,
        { backgroundColor: disabled ? '#ddd' : theme.accent },
      ]}
      disabled={disabled}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator size={25} color="#fff" />
        ) : (
          <Text
            style={[
              styles.text,
              {
                color: theme.text,
                fontSize: rf(2),
                fontWeight: 'bold',
              },
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    borderRadius: rw(2),
    paddingVertical: rh(2.3),
    paddingHorizontal: rw(4),
    alignItems: 'center',
    marginVertical: rh(1.5),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SaveButton;
