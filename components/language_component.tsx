import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useRouter } from 'expo-router';
import Button from './button';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging'
import axios from 'axios';

const data = [
    { lan: "English", code: "en" },
    { lan: "हिन्दी", code: "hi" },
    { lan: "मराठी", code: "mr" },
    { lan: "ગુજરાતી", code: "gu" },
    { lan: "தமிழ்", code: "ta" },
    { lan: "తెలుగు", code: "te" },
    { lan: "ਪੰਜਾਬੀ", code: "pa" },
    { lan: "മലയാളം", code: "ml" },
    { lan: "বাংলা", code: "bn" },
    { lan: "ଓଡ଼ିଆ", code: "or" },
    { lan: "ಕನ್ನಡ", code: "kn" }
];

const Language_button = ({ lan, code, language, setLanguage }) => {
    const isSelected = code === language;

    return (
        <TouchableOpacity
            onPress={() => setLanguage(code)}
            style={styles.buttonWrapper}
        >
            <View style={[
                styles.languageButton,
                isSelected && styles.selectedLanguage
            ]}>
                <Text style={styles.languageText}>{lan}</Text>
                {isSelected && <Text style={styles.checkmark}>✔️</Text>}
            </View>
        </TouchableOpacity>
    );
};

const Language_component = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const [fcmToken, setfcmToken] = useState({ data: "" });
    const router = useRouter();

    const changeLanguage = (code) => {
        setLanguage(code);
    };

    const API_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pushNotification/add`;

    //  useEffect(() => {
    //      // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    //     const getToken = async () => {
    //       try {
    //         // const token = await messaging().getToken();
    //         // console.log('FCM Token:', token);
    //         // setfcmToken(token);
    //         console.log(' Push Token:', fcmToken);
    //       } catch (error) {
    //         console.error('Error getting FCM token:', error);
    //       }
    //     }
    //     getToken();
    //   }, []);

    const sendFcmToken = async (PushToken, language) => {
          try {
            const response = await axios.post(API_URL, { fcm_token: PushToken,  language: language });
            console.log('FCM Token sent:', response.data);
          } catch (error) {
            console.error('Error sending FCM token:', error.response?.data || error.message);
          }
    };




    const handleDone = async () => {
        await AsyncStorage.setItem('language', language)
        // await sendFcmToken(fcmToken, language);
        await AsyncStorage.getItem('visit').then((value) => {
            if (value === null) {
                AsyncStorage.setItem('visit', '1')
                i18n.changeLanguage(language);
                router.push("/feature")
            }
            else {
                AsyncStorage.setItem('visit', (parseInt(value) + 1).toString())

                AsyncStorage.getItem('visit').then((visitCount) => {
                    console.log("visit count: ", visitCount)
                })
                i18n.changeLanguage(language);
                router.replace("/home")
            }
        })


    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("language")}</Text>

            <View style={styles.gridContainer}>
                {data.map((item) => (
                    <Language_button
                        key={item.code}
                        lan={item.lan}
                        code={item.code}
                        language={language}
                        setLanguage={changeLanguage}
                    />
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <Button handleDone={handleDone} buttonName="Done" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 35,
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    buttonWrapper: {
        width: '48%',
        marginBottom: 13,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },
    selectedLanguage: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
    },
    languageText: {
        flex: 1,
        fontSize: 18,
    },
    checkmark: {
        color: '#2196f3',
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 15,
        paddingHorizontal: 15,
    }
});

export default Language_component;