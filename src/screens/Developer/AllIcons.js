import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../themes/ThemeContext';

// create a component
const AllIcons = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();


  const { state, dispatch } = useContext(AppContext);

  // Base URL for your API or CDN
  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  const [icons, setIcons] = useState([]);
  const [visible, setVisible] = useState(false);
  const [SelectedId, setSelectedId] = useState(null);
  const [SelectedType, setSelectedType] = useState(null);
  const [SelectedImage, setSelectedImage] = useState(null);
  const [SelectedName, setSelectedName] = useState(null);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };

  // Function to fetch icons
  const fetchIconData = async () => {
    try {
      const response = await apiClient.get('/icons');
      setIcons(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchIconData();
    }, [])
  );

  const IconClick = (iconId, iconType, iconImage, iconName) => {
    setSelectedId(iconId);
    setSelectedType(iconType);
    setSelectedImage(iconImage);
    setSelectedName(iconName);

    showModal(); // Show the modal
    dispatch({ type: 'SET_ICON_ID', payload: iconId });
  };

  const deleteIcon = async () => {
    try {
      // Show confirmation before deletion
      Alert.alert(
        "Delete Icon",
        "Are you sure you want to delete this icon?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                // Send DELETE request
                const response = await apiClient.delete(`/icons/${state.selectIconId}`);

                // If the delete was successful, update the icons state
                if (response.status === 204) {
                  Alert.alert("Icon deleted successfully");

                  // Remove the deleted icon from the state
                  setIcons((prevIcons) =>
                    prevIcons.filter((icon) => icon.id !== state.selectIconId)
                  );

                  // Close the modal
                  hideModal();
                } else {
                  Alert.alert("Failed to delete icon");
                }
              } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                  // Show server error message
                  Alert.alert("Error", error.response.data.error);
                } else {
                  Alert.alert("Error", "An unexpected error occurred.");
                }
                console.error('Error deleting icon:', error);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting icon:", error);
      Alert.alert("Error", "Could not delete the icon. Please try again.");
    }
  };

  const handleUpdate = () => {
    // Hide the modal and navigate to 'IconUpdate' with the selected icon details
    hideModal();
    navigation.navigate('IconUpdate', {
      iconId: SelectedId,
      iconType: SelectedType,
      iconImage: SelectedImage,
      iconName: SelectedName,
    });
  };

  return (
    <PaperProvider>
      <View className="p-3 flex-1 flex-row flex-wrap" style={{backgroundColor:theme.primary}}>
        <View>
          <View className="px-3">
            <Text class="font-bold" style={{color:theme.text}}>Categories</Text>
            <View className="flex-row flex-wrap mt-2">
              {icons.map((icon) => (
                icon.type === "Categories" && (
                  <TouchableOpacity
                    key={icon.id}
                    onPress={() => IconClick(icon.id, icon.type, BASE_URL + icon.path, icon.name)}
                    className="bg-white p-1 m-1 mb-3"
                    style={{ width: 60, height: 60, borderRadius: 5, backgroundColor:theme.secondary, borderWidth:1, borderColor:theme.border  }}
                  >
                    <Image
                      source={{ uri: BASE_URL + icon.path }}
                      style={{ width: '100%', height: '100%', borderRadius: 5 }}
                    />
                    {/* <View className="flex-row justify-between p-1 bg-white">
                      <View className='flex-row items-center space-x-1'>
                        <MaterialIcons
                          color="black"
                          name="account-balance-wallet"
                          size={8}
                        />
                        <Text style={{ fontSize: 8 }}>{icon.wallets_in_use}</Text>
                      </View>
                      <View className='flex-row items-center space-x-1'>
                        <MaterialIcons
                          color="black"
                          name="category"
                          size={8}
                        />
                        <Text style={{ fontSize: 8 }}>{icon.categories_in_use}</Text>
                      </View>
                    </View> */}
                  </TouchableOpacity>
                )
              ))}
            </View>
          </View>
          <View className="px-3 mt-4">
            <Text class="font-bold" style={{color:theme.text}}>Wallets</Text>
            <View className="flex-row flex-wrap mt-2">
              {icons.map((icon) => (
                icon.type === "Wallet" && (
                  <TouchableOpacity
                    key={icon.id}
                    onPress={() => IconClick(icon.id, icon.type, BASE_URL + icon.path, icon.name)}
                    className="bg-white p-1 m-1 mb-3"
                    style={{ width: 60, height: 60, borderRadius: 5, backgroundColor:theme.secondary, borderWidth:1, borderColor:theme.border }}
                  >
                    <Image
                      source={{ uri: BASE_URL + icon.path }}
                      style={{ width: '100%', height: '100%', borderRadius: 5}}
                    />
                    {/* <View className="flex-row justify-between p-1 bg-white">
                      <View className='flex-row items-center space-x-1'>
                        <MaterialIcons
                          color="black"
                          name="account-balance-wallet"
                          size={8}
                        />
                        <Text style={{ fontSize: 8 }}>{icon.wallets_in_use}</Text>
                      </View>
                      <View className='flex-row items-center space-x-1'>
                        <MaterialIcons
                          color="black"
                          name="category"
                          size={8}
                        />
                        <Text style={{ fontSize: 8 }}>{icon.categories_in_use}</Text>
                      </View>
                    </View> */}
                  </TouchableOpacity>
                )
              ))}
            </View>
          </View>
        </View>

        {/* Modal for displaying icon information */}
        <Portal>
          <Modal className="m-4" visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <View className="bg-gray-200 items-center p-3 justify-center">
              <Image
                className="shadow-md rounded-md"
                source={{ uri: SelectedImage }}
                style={{ width: 100, height: 100 }}
              />
              <Text className="mt-2">ICON</Text>
            </View>
            <Button className="bg-gray-300 mt-2 rounded-md" onPress={handleUpdate}>Update</Button>
            <Button className="bg-red-200 mt-2 rounded-md" onPress={deleteIcon}>Delete</Button>
            <Button className="bg-gray-300 mt-2 rounded-md" onPress={hideModal}>Close</Button>
          </Modal>
        </Portal>

        <TouchableOpacity onPress={() => navigation.navigate('IconUpload')} className="p-3" style={{backgroundColor:theme.accent, borderRadius:10, position:"absolute", bottom:20, right:30}}>
           <MaterialIcons color={theme.text} name="add" size={22} />
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

//make this component available to the app
export default AllIcons;
