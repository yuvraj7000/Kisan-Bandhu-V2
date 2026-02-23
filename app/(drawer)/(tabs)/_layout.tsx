import React from 'react';
import { View, Image, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
const icons = {
  crop: require('../../../assets/tabBar_icons/farmer.png'),
  news: require('../../../assets/tabBar_icons/news.png'),
  market: require('../../../assets/tabBar_icons/market.png'),
  other: require('../../../assets/tabBar_icons/crop.png'),
};

const TabIcon = ({ icon, color, name, focused }) => {
  const { t } = useTranslation();
  return (
    <View style={{width:100, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={icons[icon]}
        resizeMode="contain"
        style={{ tintColor: color, width: 30, height: 30 }}
      />
      <Text
      style={
        {
          color: focused ? "#FFA001" : "#000000",
          fontSize: 14,
          marginTop: 2,
          fontFamily: 'Poppins_400Regular',
          fontWeight: focused ? 'bold' : 'normal',
      }}>{t(name)}</Text>
    </View>
  );
};

const RootLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#000000",
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 15, 
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 75,
          paddingTop: 18,
          justifyContent: 'center',
          
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="crop"
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="market"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="market"
              color={color}
              name="Markets"
              focused={focused}
            />
          ),
        }}
      />

<Tabs.Screen
        name="schems"
        options={{
          headerShown: false,
          title: "schems",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="weather"
              color={color}
              name="Schemes"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="news"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="news"
              color={color}
              name="News"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="other"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="other"
              color={color}
              name="Crops"
              focused={focused}
            />
          ),
        }}
      />
      
    </Tabs>
  );
};

export default RootLayout;