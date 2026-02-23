import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import React from 'react'
import Market_card from '@/components/market_card'
import Dignose_card from '@/components/dignose_card'
import Weather_card from '@/components/weather_card'
import Diagnose_history from '@/components/diagnose_history'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Home= () => {
  
  const { t } = useTranslation()
  return (
    <SafeAreaView>
    <ScrollView>
    <View style={styles.container}>
        <Text style={styles.moto}>{t('app_slogan')}</Text>
        <Weather_card />
        <Market_card />
        <Dignose_card />
        <Diagnose_history/>
    </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moto: {
    padding: 20,
  
    fontSize: 15,
    // fontWeight: 'bold',
    color: 'black',
  },
  weather: {
    padding: 20,
    width: 350,
    height: 160,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})