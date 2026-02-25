import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import icon from '../../context/crop/crops'
import nameTranslation from '../../context/crop/crops.json'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface Paragraph {
  paragraph_title: string;
  paragraph_content: string;
}

interface CropData {
  id: number;
  name: string;
  image_url: string;
  paragraphs: Paragraph[];
}

const Crop = () => {
  const { t, i18n } = useTranslation();
  const { name } = useLocalSearchParams();
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigation = useNavigation();


  useEffect(() => {
    const fetchCropData = async () => {
      console.log(name)
      try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/crop/get`, {
          name: name,
          language_code: i18n.language
        });
        console.log(response.data);
        setCropData(response.data.crop);
      } catch (err) {
        setError('Failed--fetch crop data');
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, [name]);

  if (loading) {
    return (
      <View style={styles.loadcontainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Image source={icon[name]} style={styles.icon} />
        <Text style={styles.loadingtext}>{t("Loading Crop")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadcontainer}>
        <Image source={icon[name]} style={styles.icon} />
        <Text style={styles.loadingtext} >{t("Information will be updated soon. ! Thank You")}</Text>
        <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
          <Text style={styles.choiceText}>{t("Back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!cropData) {
    return (
      <View style={styles.loadcontainer}>
        <Image source={icon[name]} style={styles.icon} />
        <Text style={styles.loadingtext} >{t("Information will be updated soon. ! Thank You")}</Text>
        <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
          <Text style={styles.choiceText}>{t("Back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: cropData.image_url }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>
        {nameTranslation.find((item) => item.name === cropData.name)?.[i18n.language]?.toUpperCase() || cropData.name.toUpperCase()}
      </Text>

      {cropData.paragraphs.map((paragraph, index) => (
        <View key={index} style={styles.paragraphContainer}>
          <Text style={styles.paragraphTitle}>
            {paragraph.paragraph_title}
          </Text>
          <Text style={styles.paragraphContent}>
            {paragraph.paragraph_content}
          </Text>
        </View>
      ))}
      {
          !cropData.paragraphs.length && (
            <View>
               <Text style={styles.loadingtext} >{t("Information will be updated soon. ! Thank You")}</Text>
        <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
          <Text style={styles.choiceText}>{t("Back")}</Text>
        </TouchableOpacity>
            </View>
          )
      }
    </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 80,
    marginTop:20,
    alignItems: 'center',
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraphContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paragraphTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  paragraphContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a4a4a',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  loadcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingtext: {
    margin: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 0
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 10,
  },
  faildetext: {
    fontSize: 20,
    fontWeight: '600',
    color: 'red',
    marginTop: 10,
  }
});

export default Crop;