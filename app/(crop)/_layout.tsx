import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';

const cropLayout = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
    <Stack>
      <Stack.Screen
        name="crop"
        options={{
          title: 'crop',
          headerShown: false,
        }}
      />
    </Stack>
    </SafeAreaProvider>
  );
}

export default cropLayout