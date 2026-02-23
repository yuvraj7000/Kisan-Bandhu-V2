import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import statesData from '../context/i18n/state_district.json';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging'



const CustomDropdown = ({ items, placeholder, onValueChange, value, style }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const selectedLabel = items.find(item => item.value === value)?.label || placeholder;

  return (
    <View style={[styles.dropdownContainer, style]}>
      <TouchableOpacity 
        style={styles.dropdownHeader} 
        onPress={() => setVisible(!visible)}
      >
        <Text style={styles.dropdownHeaderText}>
          {selectedLabel}
        </Text>
        <Text style={styles.arrow}>{visible ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.dropdownList}>
            <ScrollView>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const Dropdown = () => {
  const { t, i18n } = useTranslation();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [send, setSend] = useState(false);
  const [error, setError] = useState(false);
  const [language, setLanguage] = useState(i18n.language);
  const [expoPushToken, setExpoPushToken] = useState(null);


  useEffect(() => {
    setLanguage(i18n.language);
     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        setExpoPushToken({ data: token });
        console.log(' Push Token:', expoPushToken);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    }
    getToken();
  }, [i18n.language, language]);

  

  const API_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pushNotification/add`;


  const stateItems = statesData.states.map((item) => ({
    label: item.state[language],
    value: item.state.en, // Only English value is used for API requests
  }));

  const districtItems =
    selectedState &&
    statesData.states
      .find((item) => item.state.en === selectedState)
      ?.districts.map((district) => ({
        label: district[language],
        value: district.en, // Only English value is used for API requests
      })) || [];


  const sendFcmToken = async (expoPushToken, selectedDistrict) => {
    try {
      const response = await axios.post(API_URL, { fcm_token: expoPushToken.data, district: selectedDistrict, language: language });
      console.log('FCM Token sent:', response.data);
      setSend(true);
      setError(false)
    } catch (error) {
      setError(true)
      setSend(false)
      console.error('Error sending FCM token:', error.response?.data || error.message);
    }
  };



  const handleSearch = () => {


    if (selectedState && selectedDistrict && expoPushToken?.data) {
      try {
        sendFcmToken(expoPushToken, selectedDistrict);
        console.log('FCM Token sent:', expoPushToken, selectedDistrict);
        setSend(true);
        setError(false)
      } catch (error) {
        setError(true)
        setSend(false)
        console.error('Error sending FCM token:', error.response?.data || error.message);
      }
    }
    else {
      console.log('Please select district');
    }

  };


  return (
    <View style={styles.container}>

      <Text style={styles.label}>{t("Select State")} - </Text>
      {/* <RNPickerSelect
        onValueChange={(value) => {
          setSelectedState(value);
          setSelectedDistrict(null);
        }}
        placeholder={{ label: t("Select State"), value: null }}
        items={stateItems}
        style={pickerSelectStyles}
        value={selectedState}
      /> */}

<CustomDropdown
        items={stateItems}
        placeholder={t("Select State")}
        onValueChange={(value) => {
          setSelectedState(value);
          setSelectedDistrict(null);
        }}
        value={selectedState}
        style={styles.dropdown}
      />


      {selectedState && (
        <>
          <Text style={styles.label}>{t("Select District")} - </Text>
          {/* <RNPickerSelect
            onValueChange={(value) => setSelectedDistrict(value)}
            placeholder={{ label: t("Select District"), value: null }}
            items={districtItems}
            style={pickerSelectStyles}
            value={selectedDistrict}
          /> */}

<CustomDropdown
        items={districtItems}
        placeholder={t("Select District")}
        onValueChange={(value) => {
          setSelectedDistrict(value);
        }}
        value={selectedDistrict}
        style={styles.dropdown}
      />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>{t("Add Area for Notifications")}</Text>
      </TouchableOpacity>

      {send && (
        <View style={styles.done}>
          <Text style={styles.donetext}>{t("Successfully added Area for Notification")}</Text>
        </View>
      )}
      {error && (
        <View style={styles.done}>
          <Text style={styles.errtext}>{t("failed to setup your notifications")}</Text>
          <Text style={styles.trytext}>{t("Try Again")}</Text>
        </View>
      )}
      {!send && !error && (
        <View style={styles.done}>
          <Text style={styles.dtext}>{t("select state and district for notifications")}</Text>
        </View>
      )}

      <View style={styles.description}>
        <Text style={styles.destext}> {t("Stay updated with real-time notifications about important updates, weather alerts, and government schemes tailored to your selected district. Add your area now to never miss out on critical information!")}</Text>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 10,
  },
  label: {
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  notext: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  noimage: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 10,
  },
  done: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  donetext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    padding: 20,
  },
  errtext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  trytext: {
    fontSize: 20,
    color: 'grey',
    textAlign: 'center',
    marginTop: 10,
  },
  dtext: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    padding: 20,
  },
  description: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',

  },
  destext: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 10,
  },







  // Dropdown styles
  // container: {
  //   flex: 1,
  // },
  label: {
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    margin: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  notext: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  noimage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  dropdownContainer: {
    marginHorizontal: 15,
    marginVertical: 2,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'white',
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownList: {
    maxHeight: 700,
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 4,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 18,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  dropdown: {
    marginHorizontal: 15,
  },
});


export default Dropdown;
