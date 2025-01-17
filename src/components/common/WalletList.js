import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { AppContext } from '../../context/AppContext';
import  { useTheme } from '../../themes/ThemeContext';
import { rw, rh, rf } from '../../themes/responsive';



const WalletList = ({ rightIcon, imageIcon, title, balance, onPress, onPressTransfer, onPressDelete, onPressEdit }) => {
  const { state } = useContext(AppContext);
  const { theme } = useTheme();


  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor="rgba(0, 0, 0, .32)"
      style={{ backgroundColor: theme.secondary, borderRadius: 8 }}
      className="mb-1"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Image 
            source={{ uri: imageIcon }}
            style={styles.image} 
          />
          <View>
            <Text style={{ color: theme.text }}>{title}</Text>
            <Text style={{ color: theme.text }}>{balance}</Text>
          </View>
        </View>

        {rightIcon ? (
          <View>
            <Menu>
              <MenuTrigger>
                <MaterialIcons 
                  color={theme.text}
                  name="more-vert"
                  size={22} 
                  style={{width:rw(10), textAlign:"center", paddingVertical:5}}
                />
              </MenuTrigger>
              <MenuOptions style={{ backgroundColor: theme.secondary, borderWidth:0.5, borderColor:theme.border}}>
                <MenuOption onSelect={onPressTransfer} style={{ padding: 10,  borderBottomWidth:0.5, borderColor:theme.border}}>
                  <Text style={{ color: theme.text, paddingVertical:5, textAlign:"center"}}>Transfer</Text>
                </MenuOption>
                <MenuOption onSelect={onPressEdit} style={{ padding: 10,  borderBottomWidth:0.5, borderColor:theme.border}}>
                  <Text style={{ color: theme.text, paddingVertical:5, textAlign:"center"}}>Update</Text>
                </MenuOption>
                <MenuOption onSelect={onPressDelete} style={{ padding: 10 }}>
                  <Text style={{ color: theme.text, paddingVertical:5, textAlign:"center"}}>Delete</Text>
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
    borderRadius:5
  },
});

export default WalletList;
