import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const Dignose_card = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const handleNavigate = () => {
    router.push('/diagnose');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Plant Diagnosis")}</Text>
      <Text style={styles.description}>
        {t("Upload an image of your plant to identify diseases and get solutions tailored to your needs.")}
      </Text>
      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <Image source={require('../assets/icons/diagnose_icons/takeImage.png')} style={styles.icon} />
          <Text style={styles.stepText}>{t("Take Image")}</Text>
        </View>
        <Image source={require('../assets/icons/diagnose_icons/arrow.png')} style={styles.arrow} />
        <View style={styles.step}>
          <Image source={require('../assets/icons/diagnose_icons/getDiagnose.png')} style={styles.icon} />
          <Text style={styles.stepText}>{t("Get Diagnose")}</Text>
        </View>
        <Image source={require('../assets/icons/diagnose_icons/arrow.png')} style={styles.arrow} />
        <View style={styles.step}>
          <Image source={require('../assets/icons/diagnose_icons/seeSolution.png')} style={styles.icon} />
          <Text style={styles.stepText}>{t("See Solution")}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleNavigate} style={styles.linkContainer}>
        <Text style={styles.linkText}>{t("Take a Photo")}</Text>
        <Image source={require('../assets/icons/diagnose_icons/takePhoto.png')} style={styles.takePhoto} />
      </TouchableOpacity>
    </View>
  );
};

export default Dignose_card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',

  },
  stepsContainer: {
    margin: 20,
    // width: '100%',
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  step: {
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  stepText: {
    fontSize: 12,
    color: '#333',
  },
  arrow: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  linkContainer: {
    // marginTop: 20,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#33B249',
    borderRadius: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    marginRight: 10,
    color: '#fff',
    fontSize: 18,
  },
  takePhoto: {
    width: 25,
    height: 25,
  },
});