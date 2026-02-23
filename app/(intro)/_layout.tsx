import React from 'react'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'

const RootLayout = () => {
  const { t, i18n } = useTranslation();
  AsyncStorage.getItem('language').then((value) => {
    if (value === null) {
      i18n.changeLanguage('en')
    }
    else {
      i18n.changeLanguage(value)
    }
  })

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }}/>
      <Stack.Screen name='feature' options={{ headerShown: false }}/>
     
      
    </Stack>
  )
}

export default RootLayout