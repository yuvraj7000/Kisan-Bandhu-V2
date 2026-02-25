import React, { useEffect, useState, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import { Platform, Text, Image, TouchableOpacity, View, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import Diagnose_presentation from './diagnose_presentation';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import languages from '../context/i18n/language.json';
import saveHistory from '../context/diagnoseHistory.ts';
import { useNavigation } from '@react-navigation/native';

const PlantDiagnosis = ({ imageUri, setImage }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [failed, isFailed] = useState(false);
  const [response, setResponse] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    const handleHistorySave = async () => {
      if (response) {
        try {
          await saveHistory(imageUri, response);
        } catch (error) {
          console.log("History save error:", error);
        }
      }
    };

    handleHistorySave();
  }, [response, imageUri]);

  const uploadImage = async (uri, language) => {
    setLoading(true);
    console.log("Uploading image:", uri, "Language:", language);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formData.append('language', language);

      const res = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/diagnose/plant`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const jsonString = res.data.diagnose.replace(/```json|```/g, '');
      const diagnoseObject = JSON.parse(jsonString);
      setResponse(diagnoseObject);
      setLoading(false);
      console.log("Diagnosis response:", res);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      isFailed(true);

    }
  };

  if (response) {
    return <Diagnose_presentation imageUri={imageUri} data={response} />;
  }

  const handleRightChoice = async() => {
    await uploadImage(imageUri, languages[i18n.language]);
  };

  const handleWrongChoice = () => {
    setImage(null);
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <TouchableOpacity
          onPress={() => setIsFullScreen(true)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <Text>No image selected</Text>
      )}

      {!failed && <View style={styles.choiceContainer}>
        <TouchableOpacity style={styles.choiceButton} onPress={handleRightChoice}>
          <Text style={styles.choiceText}>{t("See Diagnose")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.choiceAnother} onPress={handleWrongChoice}>
          <Text style={styles.anotherText}>{t("choose another image")}</Text>
        </TouchableOpacity>
      </View>
      }
      {
        failed && 
        <View>
        <Text style={styles.failedText}>{t("This Service is currently unavailable, please try again later")}</Text>
        <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
          <Text style={styles.choiceText}>{t("Back")}</Text>
        </TouchableOpacity>   
        </View>
      }

      {/* Full Screen Image Modal */}
      <Modal
        visible={isFullScreen}
        transparent={true}
        onRequestClose={() => setIsFullScreen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsFullScreen(false)}>
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {loading && (
        <View style={styles.overlay}>
          <View style={styles.animationContainer}>
            <LottieView
              autoPlay
              ref={animation}
              style={styles.lottie}
              source={require('../assets/animations/plant.json')}
            />
            <Text style={styles.loadingText}>{t("Analyzing your plant...")}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  choiceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 80,
    marginTop:20,
    alignItems: 'center',
  },
  failedText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  choiceAnother: {
    marginTop: 10,
    padding: 5,
    borderRadius: 8,
  },
  anotherText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  loadingText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#333',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default PlantDiagnosis;