import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  Animated, 
  Easing 
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Language_component from '@/components/language_component';

const Index = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [covered, setCovered] = useState(true);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current; 
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    if (covered) {
   
      Animated.sequence([
    
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.05, 
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
    
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(async() => {
        const value = await AsyncStorage.getItem('language');
        if (value !== null) {
          router.replace('/home');
        }
        else{
          setCovered(false);
        }
        
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [covered]);

  if (covered) {
    return (
      <View style={styles.coverContainer}>
        <Animated.Image
          source={require('../../assets/icons/cover_image.jpeg')}
          style={[
            styles.coverImage,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
          resizeMode="cover"
        />
        <Animated.View style={[styles.welcomeContainer, { opacity: textFadeAnim }]}>
          <Text style={styles.welcomeText}>{t("app_name")}</Text>
          <Animated.View 
            style={[
              styles.underline,
              { 
                transform: [{
                  scaleX: textFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                  })
                }] 
              }
            ]}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image 
              style={styles.logo} 
              source={require('../../assets/icons/applogo.png')} 
            />
          </View>
          <Language_component />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  welcomeContainer: {
    position: 'absolute',
    top: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  underline: {
    height: 2,
    width: '80%',
    backgroundColor: '#fff',
  },
});

export default Index;