import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Language_component from '@/components/language_component'

const Language = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <Language_component />
    </ScrollView>

  )
}

export default Language

const styles = StyleSheet.create({})