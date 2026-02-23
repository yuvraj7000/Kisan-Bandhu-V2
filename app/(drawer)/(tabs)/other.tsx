import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Crop_section from '@/components/crop_section';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'expo-router';

const Other = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const handleChangeLanguage = () => {
    console.log('Change Language button pressed');
    navigation.navigate('language'); 
  };

  const handleNotificationSettings = () => {
    console.log('Notification Settings button pressed');
    navigation.navigate('profile'); 
  };

  return (
    <View style={styles.container}>
      <Crop_section />
      
      <View style={styles.buttonsContainer}>
       
        <TouchableOpacity style={styles.button} onPress={handleChangeLanguage}>
          <Text style={styles.buttonText}>{t("Change Language")}</Text>
        </TouchableOpacity>
    
        {/* <TouchableOpacity style={styles.button} onPress={handleNotificationSettings}>
          <Text style={styles.buttonText}>{t("Notification Settings")}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Other;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    gap: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  button: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 8,
  
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

});