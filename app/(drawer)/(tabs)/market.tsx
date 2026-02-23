import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import Dropdown from '@/components/dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';


const Market = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          <Dropdown />
         
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Market;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
  },
  intruction: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moto: {
    padding: 20,
    fontSize: 15,
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
});



