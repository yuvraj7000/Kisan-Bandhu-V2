import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

const WeatherLayout = () => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen
        name="weather"
        options={{
          title: t("16 days weather"),
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default WeatherLayout;