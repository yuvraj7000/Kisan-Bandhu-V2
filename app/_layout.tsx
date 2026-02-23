import { Stack } from "expo-router";
import "../context/i18n/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from 'react-redux'
import { StatusBar } from 'expo-status-bar';
import { store } from "../context/redux/store";

export default function RootLayout() {
 


  return (
    <Provider store={store}>
      <StatusBar style="light" backgroundColor="#000" translucent={false} />
  <Stack>
    <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    <Stack.Screen name="(intro)" options={{ headerShown: false }} />
    <Stack.Screen name="(diagnose)" options={{ headerShown: false }} />
    <Stack.Screen name="(weather)" options={{ headerShown: false }} />
    <Stack.Screen name="(crop)" options={{ headerShown: false }} />
  </Stack>

  </Provider>
  );
}
