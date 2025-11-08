import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const { hasCompletedOnboarding, setHasCompletedOnboarding, setUser, setPreferences, setStreak } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem('onboarding_complete');
      const userId = await AsyncStorage.getItem('user_id');
      
      if (onboardingComplete === 'true' && userId) {
        // Load user data from AsyncStorage
        const userData = await AsyncStorage.getItem('user_data');
        const prefsData = await AsyncStorage.getItem('preferences_data');
        const streakData = await AsyncStorage.getItem('streak_data');
        
        if (userData) setUser(JSON.parse(userData));
        if (prefsData) setPreferences(JSON.parse(prefsData));
        if (streakData) setStreak(JSON.parse(streakData));
        
        setHasCompletedOnboarding(true);
        router.replace('/home');
      } else {
        router.replace('/onboarding/welcome');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      router.replace('/onboarding/welcome');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B35" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
