import * as FileSystem from 'expo-file-system';
import { manipulateAsync } from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveHistory = async (imageUri, response) => {
  try {
    const compressedImage = await manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: 'jpeg' }
    );

    const filename = compressedImage.uri.split('/').pop();
    const newPath = `${FileSystem.documentDirectory}${filename}`;
    
    await FileSystem.moveAsync({
      from: compressedImage.uri,
      to: newPath,
    });

    const historyItem = {
      imageUri: newPath,
      response,
      timestamp: Date.now(),
    };

    const existingHistory = await AsyncStorage.getItem('diagnose_history');
    const parsedHistory = existingHistory ? JSON.parse(existingHistory) : [];
    const updatedHistory = [historyItem, ...parsedHistory].slice(0, 50);
    
    await AsyncStorage.setItem('diagnose_history', JSON.stringify(updatedHistory));

    return true;
  } catch (error) {
    console.error('Error saving history:', error);
    throw error;
  }
};
export default saveHistory;