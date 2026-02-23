import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView
} from 'react-native-safe-area-context';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import weather_icon from '../../context/weather_icon/weather_icon.json';
import axios from 'axios';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';

const Weather = () => {
  const { t } = useTranslation();
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    coords: { latitude: number; longitude: number };
    city: string;
    country: string;
  }>({
    coords: { latitude: 0, longitude: 0 },
    city: '',
    country: ''
  });
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    (async () => {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      // Get current position
      let location = await Location.getCurrentPositionAsync({});
      
      // Reverse geocode to get city/country
      const geo = await Location.reverseGeocodeAsync(location.coords);
      
      // Update location state
      setLocation({
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        city: geo[0]?.city || 'Unknown City',
        country: geo[0]?.country || 'Unknown Country'
      });

      // Fetch weather data with current coordinates
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/weather/forcast?lat=${location.coords.latitude}&lon=${location.coords.longitude}`
        );

        const { hourlyRes, dailyRes } = response.data;

        console.log("hourlyRes : ", hourlyRes.list);

        // Process data
        const processedHourly = processHourlyData(hourlyRes.list);
        const processedDaily = dailyRes.list.slice(4, 16);
        
        setHourlyData(processedHourly);
        setDailyData(processedDaily);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setErrorMsg('Failed to fetch weather data');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Image source={require('../../assets/icons/failed_weather.png')} style={{ width: 100, height: 100 }} />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Text style={styles.errorSubtext}>{t("Failed to load weather data")}</Text>
      </View>
    );
  }

  const processHourlyData = (list) => {
    const grouped = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped[date]) {
        grouped[date] = {
          hours: [],
          minTemp: Infinity,
          maxTemp: -Infinity
        };
      }
      
      const temp = item.main.temp - 273.15;
      grouped[date].minTemp = Math.min(grouped[date].minTemp, temp);
      grouped[date].maxTemp = Math.max(grouped[date].maxTemp, temp);
      grouped[date].hours.push(item);
    });
    
    return Object.keys(grouped)
      .sort()
      .slice(0, 4)
      .map(date => ({
        date,
        ...grouped[date]
      }));
  };

  const getSprayCondition = (windSpeed) => {
    const mph = windSpeed * 2.23694; // Convert m/s to mph
    if (mph >= 2 && mph <= 4) {
        return { text: 'Good for Spraying', color: '#4CAF50', advice: 'Conditions are ideal for spraying.' };
    }
    if ((mph >= 1 && mph < 2) || (mph > 4 && mph <= 5)) {
        return { text: 'Moderate for Spraying', color: '#FFC107', advice: 'Spray with caution to avoid drift.' };
    }
    if (mph > 5) {
        return { text: 'Avoid Spraying', color: '#F44336', advice: 'High wind speeds may cause spray drift.' };
    }
    return { text: 'Avoid Spraying', color: '#F44336', advice: 'Low wind speeds may cause uneven application.' };
};

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    return `${((hour + 11) % 12 + 1)}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(t("en-US"), {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const renderHour = (hour) => {
    const sprayCondition = getSprayCondition(hour.wind.speed);
    
    return (
      <View key={hour.dt_txt} style={styles.hourContainer}>
        <Text style={styles.timeText}>
          {formatTime(hour.dt_txt.split(' ')[1])}
        </Text>
        <Image
          source={{ uri: weather_icon[hour.weather[0].icon] }}
          style={styles.weatherIcon}
        />
        <Text style={styles.tempText}>
          {Math.round(hour.main.temp - 273.15)}°C
        </Text>
        <Text style={styles.descriptionText}>
          {t(hour.weather[0].description)}
        </Text>
        <View style={[styles.sprayCondition, { backgroundColor: sprayCondition.color }]}>
          <Text style={styles.sprayText}>{t(sprayCondition.text)}</Text>
        </View>
        <Text style={styles.popText}>🌧️ {Math.round(hour.pop * 100)}%</Text>
      </View>
    );
  };

  const renderDailyDay = (day) => {
    const sprayCondition = getSprayCondition(day.speed);
  
    return (
      <View key={day.dt} style={styles.dailyContainer}>
        <View style={styles.dailydayHeader}>
          <Text style={styles.dailydateText}>{new Date(day.dt * 1000).toLocaleDateString(t("en-US"), {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}</Text>
        </View>
        <Text style={styles.dailyminMaxText}>
          {t("High")}: {Math.round(day.temp.max - 273.15)}°C / {t("Low")}: {Math.round(day.temp.min - 273.15)}°C
        </Text>
        <View style={styles.dailyContent}>
          <Image
            source={{ uri: weather_icon[day.weather[0].icon] }}
            style={styles.weatherIcon}
          />
          <Text style={styles.descriptionText}>
            {t(day.weather[0].description)}
          </Text>
          <Text style={styles.popText}>🌧️ {Math.round(day.pop * 100)}% {t("Precipitation")}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={styles.lottie}
          source={require('../../assets/animations/weather.json')}
        />
        <Text style={styles.loadingText}>{t("loading Weather")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>
            {location.city}, {t(location.country)}
          </Text>
          <Text style={styles.subtitle}>{t("4 days Hourly")}</Text>
        </View>

        {/* Hourly Forecast Section */}
        {hourlyData.map((day) => (
          <View key={day.date} style={styles.hourdayContainer}>
            <View style={styles.hourdayHeader}>
              <Text style={styles.hourdateText}>
                {new Date(day.date).toLocaleDateString(t("en-US"), {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              <Text style={styles.minMaxText}>
                {t("High")}: {Math.round(day.maxTemp)}°C / {t("Low")}: {Math.round(day.minTemp)}°C
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {day.hours.map(hour => renderHour(hour))}
            </ScrollView>
          </View>
        ))}

        {/* Daily Forecast Section */}
        <Text style={styles.sectionTitle}>{t("next 12 days")}</Text>
        <View style={styles.dailyGrid}>
          {dailyData.map(day => renderDailyDay(day))}
        </View>

        {/* Disclaimer Section */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerHeading}>{t("Important Note for Farmers")}</Text>
          <Text style={styles.disclaimerText}>
            • {t("Weather forecasts are estimates and actual conditions may vary")}{'\n'}
            • {t("Always verify field conditions before agricultural operations")}{'\n'}
            • {t("Wind speed recommendations are general guidelines")}{'\n'}
            • {t("Consider microclimate variations in your specific location")}{'\n'}
            • {t("Consult local agricultural authorities for critical decisions")}{'\n'}
            • {t("Forecast data source: OpenWeatherMap API")}{'\n\n'}
            {t("This information should not be used as sole basis for farming decisions.")}{' '}
            {t("The developers assume no liability for actions taken based on this forecast.")}
          </Text>
        </View>

        <View style={styles.last} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  hourdayContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
    marginHorizontal: 8,
  },
  hourdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#cae1ed',
  },
  hourdateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    flex: 1,
  },
  minMaxText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
  },
  hourContainer: {
    alignItems: 'center',
    margin: 5,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 6,
    width: 120,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  timeText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  weatherIcon: {
    width: 48,
    height: 48,
    marginVertical: 4,
  },
  tempText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
    height: 28,
  },
  sprayCondition: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginVertical: 2,
    width: '100%',
  },
  sprayText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  popText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 26,
    marginLeft: 26,
    marginBottom: 20,
  },
  dailyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dailyContainer: {
    width: '45%',
    margin: 5,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    paddingBottom: 8,
  },
  dailydayHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#cae1ed',
    alignItems: 'center',
    padding: 8,
  },
  dailydateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    flex: 1,
  },
  dailyminMaxText: {
    padding: 8,
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
  },
  dailyContent: {
    alignItems: 'center',
    padding: 8,
  },
  disclaimerContainer: {
    margin: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  disclaimerHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6c757d',
  },
  last: {
    height: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  },
  loadingText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#333',
  },
});

export default Weather;