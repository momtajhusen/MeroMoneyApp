import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { AppContext } from '../../context/AppContext';
import { lightTheme, darkTheme } from '../../themes';

const WalletList = ({ rightIcon, imageIcon, title, balance, onPress, onPressDelete, onPressEdit }) => {
  const { state } = useContext(AppContext);
  const themeColor = state.theme.themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor="rgba(0, 0, 0, .32)"
      style={{ backgroundColor: themeColor.secondary, borderRadius: 8 }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Image 
            source={{ uri: imageIcon }}
            style={styles.image} 
          />
          <View>
            <Text style={{ color: themeColor.text }}>{title}</Text>
            <Text style={{ color: themeColor.text }}>{balance}</Text>
          </View>
        </View>

        {rightIcon ? (
          <View>
            <Menu>
              <MenuTrigger>
                <MaterialIcons 
                  color={themeColor.text}
                  name="more-vert" 
                  size={22} 
                />
              </MenuTrigger>
              <MenuOptions style={{ backgroundColor: themeColor.primary }}>
                <MenuOption onSelect={onPressEdit} style={{ padding: 10 }}>
                  <Text style={{ color: themeColor.text }}>Update</Text>
                </MenuOption>
                <MenuOption onSelect={onPressDelete} style={{ padding: 10 }}>
                  <Text style={{ color: themeColor.text }}>Delete</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        ) : null}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default WalletList;
