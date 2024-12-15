//import liraries
import React, { useEffect, useState,useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../themes/ThemeContext';


// create a component
const WalletsIcons = () => {

  const navigation = useNavigation();
  const route = useRoute();

  const { theme } = useTheme();


  const { dispatch } = useContext(AppContext);

    // Base URL for your API or CDN
    const BASE_URL = 'https://finance.scriptqube.com/storage/';

    const [icons, setIcons] = useState([]);

    const fetchIconData = async () => {
        try {
          const response = await apiClient.get('/icons');
          setIcons(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    useEffect(() => {
        fetchIconData();
    }, []);

    const IconCLick = (iconId, iconImage)=>{
      dispatch({ type: 'SET_ICON_ID', payload: iconId});
      dispatch({ type: 'SET_ICON_IMAGE', payload: iconImage});
        navigation.getParent()?.goBack(); 
    };

    return (
        <View className="p-1 flex-1 flex-row flex-wrap" style={{backgroundColor:theme.primary}}>

          {icons.map((icon) => (
             icon.type === "Wallet" &&(
              <TouchableOpacity 
                onPress={()=>IconCLick(icon.id, BASE_URL + icon.path)}
                key={icon.id} 
                className="bg-white p-1 m-1" 
                style={{ width: 60, height: 60, borderRadius: 5, backgroundColor:theme.secondary, borderWidth:1, borderColor:theme.border  }}

              >
              <Image 
              source={{ uri: BASE_URL + icon.path }}
              style={{ width: '100%', height: '100%', borderRadius: 5 }}
              />
             </TouchableOpacity>
            )
          ))}
        </View>
    );
};

//make this component available to the app
export default WalletsIcons;
 