import React from 'react';
import { Stack } from 'expo-router';

const DiagnoseLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="diagnose"
        options={{
          title: 'Diagnose',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="diagnosePresentation"
        options={{
          title: 'DiagnosePresentation',
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default DiagnoseLayout;
