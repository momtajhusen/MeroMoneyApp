import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { lightTheme, darkTheme } from '../themes';

const NoteSelector = ({ note, onPress }) => {
  const { state } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <TouchableOpacity className="mb-0.5" onPress={onPress}>
      <View className="space-x-4 py-4" style={[styles.noteContainer, { backgroundColor: themeColor.secondary }]}>
        <MaterialIcons color="black" name="notes" size={22} style={{ color: themeColor.text }} />
        <Text className="font-bold" style={[styles.text, { color: themeColor.text }]}>{note || 'Note'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});

export default NoteSelector;
