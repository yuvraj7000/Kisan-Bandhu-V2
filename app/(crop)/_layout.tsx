import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import React from 'react'

const cropLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="crop"
        options={{
          title: 'crop',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default cropLayout