import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// create a component
const AllIcons = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { state, dispatch } = useContext(AppContext);

  // Base URL for your API or CDN
  const BASE_URL = 'https://finance.scriptqube.com/storage/';

  const [icons, setIcons] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null); // State to hold the selected icon details

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

  useEffect(() => {
    fetchIconData();
  }, []);

  const IconClick = (iconId, iconImage) => {
    setSelectedIcon(iconImage); // Set the selected icon's image
    showModal(); // Show the modal
    dispatch({ type: 'SET_ICON_ID', payload: iconId});
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
                  // Show server error message (e.g., "This icon cannot be deleted because...")
                  Alert.alert("Error", error.response.data.error);
                } else {
                  // Handle any other errors
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
  
  return (
    <PaperProvider>
      <View className="p-1 flex-1 flex-row flex-wrap">
        <View>
        <View className="p-3">
                <Text class="font-bold">Categories</Text>
                <View className="flex-row flex-wrap">
                  {icons.map((icon) => (
                  icon.type === "Categories" && (
                      <TouchableOpacity
                      key={icon.id}
                      onPress={() => IconClick(icon.id, BASE_URL + icon.path)}
                      className="bg-white p-2 m-1 mb-3"
                      style={{ width: 60, height: 60, borderRadius: 5 }}
                      >
                      <Image
                          source={{ uri: BASE_URL + icon.path }}
                          style={{ width: '100%', height: '100%' }}
                      />
                      <View className="flex-row justify-between p-1 bg-white">
                         <View className='flex-row items-center space-x-1'>
                          <MaterialIcons 
                              color="black" 
                              name="account-balance-wallet" 
                              size={8} 
                            />
                            <Text style={{fontSize:8}}>{icon.wallets_in_use}</Text>
                         </View>
                         <View className='flex-row items-center space-x-1'>
                          <MaterialIcons 
                              color="black" 
                              name="category" 
                              size={8} 
                            />
                            <Text style={{fontSize:8}}>{icon.categories_in_use}</Text>
                         </View>
                       </View>
                      </TouchableOpacity>
                  )
                  ))}
                </View>

            </View>
            <View className="p-3">
                <Text class="font-bold">Wallets</Text>
                <View className="flex-row flex-wrap">
                  {icons.map((icon) => (
                  icon.type === "Wallet" && (
                      <TouchableOpacity
                      key={icon.id}
                      onPress={() => IconClick(icon.id, BASE_URL + icon.path)}
                      className="bg-white p-2 m-1 mb-3"
                      style={{ width: 60, height: 60, borderRadius: 5 }}
                      >
                      <Image
                          source={{ uri: BASE_URL + icon.path }}
                          style={{ width: '100%', height: '100%' }}
                      />
                      <View className="flex-row justify-between p-1 bg-white">
                         <View className='flex-row items-center space-x-1'>
                          <MaterialIcons 
                              color="black" 
                              name="account-balance-wallet" 
                              size={8} 
                            />
                            <Text style={{fontSize:8}}>{icon.wallets_in_use}</Text>
                         </View>
                         <View className='flex-row items-center space-x-1'>
                          <MaterialIcons 
                              color="black" 
                              name="category" 
                              size={8} 
                            />
                            <Text style={{fontSize:8}}>{icon.categories_in_use}</Text>
                         </View>
                       </View>
                      </TouchableOpacity>
                  )
                  ))}
                </View>

            </View>
        </View>


        {/* Modal for displaying icon information */}
        <Portal>
          <Modal className="m-4" visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            {/* <Text>Icon ID: {selectedIcon}</Text> */}
            <View className="bg-gray-200 items-center p-3 justify-center">
              <Image
                className="shadow-md rounded-md "
                source={{ uri: selectedIcon }}
                style={{ width: 100, height: 100 }}
              />
              <Text className="mt-2">ICON</Text>
            </View>
            <Button className="bg-gray-300 mt-2 rounded-md" onPress={hideModal}>Close</Button>
            <Button className="bg-red-200 mt-2 rounded-md" onPress={deleteIcon}>Delete</Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

//make this component available to the app
export default AllIcons;
