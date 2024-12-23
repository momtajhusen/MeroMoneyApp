import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import apiClient from '../../../apiClient';
import { AppContext } from '../../context/AppContext';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../themes/ThemeContext';
import { rw, rh, rf } from '../../themes/responsive';
import CustomAlert from '../../components/common/CustomAlert';



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

  
  // State for alert
  const [isModalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  // Function to fetch icons
  const fetchIconData = async () => {
    try {
      const response = await apiClient.get('/icons');
      
      // Filter data to include only items where user_id matches state.userId
      const filteredIcons = response.data.filter(icon => icon.user_id === state.userId);
      
      setIcons(filteredIcons);
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
    setModalVisible(false);
    setLoading(true);
  
    try {
      const response = await apiClient.delete(`/icons/${state.selectIconId}`);
  
      if (response.status === 204) {
        setAlertMessage("Icon deleted successfully");
        setAlertType('success');
        setAlertVisible(true);
  
        setIcons((prevIcons) =>
          prevIcons.filter((icon) => icon.id !== state.selectIconId)
        );
        hideModal();
      } else {
        setAlertMessage("Failed to delete icon");
        setAlertType('error');
        setAlertVisible(true);
      }
    } catch (error) {
      // Debugging error response
      console.error('Error deleting icon:', error);
  
      if (error.response && error.response.data && error.response.data.error) {
        setAlertMessage(error.response.data.error);
        setAlertType('info');
        setAlertVisible(true);
      } else {
        setAlertMessage("An unexpected error occurred.");
        setAlertType('error');
        setAlertVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = () => {
    deleteIcon();
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
          <Modal className="m-4 p-4" visible={visible} onDismiss={hideModal} contentContainerStyle={{backgroundColor:theme.secondary, borderRadius:10}}>
            <View className="items-center p-3 justify-center" style={{backgroundColor:theme.primary}}>
              <Image
                className="shadow-md rounded-md"
                source={{ uri: SelectedImage }}
                style={{ width: 100, height: 100 }}
              />
              <Text className="mt-2">{SelectedName}</Text>
            </View>
            <Button className="m-2 py-1 rounded-md" onPress={handleUpdate} style={{borderWidth:1, borderColor:theme.border}}>Update</Button>
            <Button className="m-2 py-1 rounded-md" onPress={() => setModalVisible(true)} style={{borderWidth:1, borderColor:theme.border}}>Delete</Button>
            <Button className="m-2 py-1 rounded-md" onPress={hideModal} style={{borderWidth:1, borderColor:theme.border}}>Close</Button>
          </Modal>
        </Portal>


        <CustomAlert
        visible={isModalVisible}
        title="Confirm Delete"
        message="Are you sure you want to delete this transaction?"
        confirmText="Delete"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleDelete}
        theme={theme}
        type="warning"
      />

      <CustomAlert
        visible={alertVisible}
        title={alertType === 'success' ? 'Success' : 'Error'}
        message={alertMessage}
        confirmText="OK"
        onOk={() => setAlertVisible(false)}
        theme={theme}
        type={alertType}
      />


        <TouchableOpacity onPress={() => navigation.navigate('IconUpload')} className="p-3" style={{backgroundColor:theme.accent, borderRadius:10, position:"absolute", bottom:20, right:30}}>
           <MaterialIcons color={theme.text} name="add" size={22} />
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

//make this component available to the app
export default AllIcons;
