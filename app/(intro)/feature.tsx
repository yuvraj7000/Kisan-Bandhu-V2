import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useTranslation  } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/button';
import { useRouter } from 'expo-router';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging'

const API_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pushNotification/add`;

const data = [
  {
    heading: 'featureCard_plant_heading',
    content: 'featureCard_plant_content',
    image: require('../../assets/icons/dignose_feature.png'),
    color: '#E67070',
  },
  {
    heading: 'featureCard_weather_heading',
    content: 'featureCard_weather_content',
    image: require('../../assets/icons/weather_feature.png'),
    color: '#70BDE6',
  },
  {
    heading: 'featureCard_mandi_heading',
    content: 'featureCard_mandi_content',
    image: require('../../assets/icons/mandi_feature.png'),
    color: '#6FCF97',
  },
  {
    heading: 'featureCard_scheme_heading',
    content: 'featureCard_scheme_content',
    image: require('../../assets/icons/scheme_feature.png'),
    color: '#F7DC6F',
  },
];

const FeatureCard = ({ heading, content, image, color }) => {
  const { t} = useTranslation();
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Image source={image} style={styles.cardImage} />
      <View style={styles.textContainer}>
        <Text style={styles.cardHeading}>{t(heading)}</Text>
        <Text style={styles.cardContent}>{t(content)}</Text>
      </View>
    </View>
  );
};

const Feature = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // Function to send FCM token to the backend
  const sendFcmToken = async (token) => {
    try {
      const response = await axios.post(API_URL, { fcm_token: token });
      console.log('FCM Token sent:', response.data);
    } catch (error) {
      console.error('Error sending FCM token:', error.response?.data || error.message);
    }
  };

  const getToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        if (token) {
          // Send the token to the backend
          await sendFcmToken(token);
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    }

  // Send FCM token when it's available
//  useEffect(() => {
//      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//      getToken();
//    }, []);

  const buttonPress = () => {
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.body}>
          <Text style={styles.subtitle}>{t('what we offer')}</Text>
          <View style={styles.cardsContainer}>
          {data.map((item, index) => (
            <FeatureCard key={index} {...item} />
          ))}
        </View>
          <Button buttonName={t('Get Started')} handleDone={buttonPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feature;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  logo: {
    height: 100, 
    width: 100, 
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10, // For Android shadow
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
    color: 'blue',
  },
  cardsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 14,
    
  },
});