import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import NotificationDropdown from '@/components/notification_dropdown'
  import {PermissionsAndroid} from 'react-native';
  import messaging from '@react-native-firebase/messaging'

const Profile = () => {
  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }
  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    getToken();
  }, []);
    
  return (
    <View>
      <NotificationDropdown/>
    </View>
  )
}

export default Profile