import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../../store/userStore';
import { createUser, createPreferences, initStreak } from '../../services/api';

export default function ReminderSetup() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setUser, setPreferences, setStreak, setHasCompletedOnboarding } = useUserStore();
  
  const [reminderTime, setReminderTime] = useState('06:30');
  const [soundscapeOn, setSoundscapeOn] = useState(true);
  const [loading, setLoading] = useState(false);

  const timeOptions = [
    '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00'
  ];

  const scheduleNotification = async (time: string) => {
    // Only schedule notifications on native platforms
    if (Platform.OS === 'web') {
      console.log('Notification scheduling not available on web');
      return;
    }
    
    try {
      const [hours, minutes] = time.split(':').map(Number);
      
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for Morning Darshan',
          body: 'Begin your peaceful morning ritual',
          sound: true,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
      
      console.log('Notification scheduled for', time);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const handleSaveAndContinue = async () => {
    setLoading(true);
    try {
      // Create user with name from params
      const userName = (params.user_name as string) || 'User';
      const userData = await createUser(userName);
      console.log('User created:', userData);
      
      // Parse selected deities
      let selectedDeities: string[] = [];
      try {
        selectedDeities = JSON.parse(params.selected_deities as string || '[]');
      } catch (e) {
        selectedDeities = [];
      }
      
      // Create preferences
      const prefsData = {
        user_id: userData.id,
        primary_deity: selectedDeities[0], // First selected for backward compatibility
        secondary_deities: selectedDeities.slice(1), // Rest as secondary
        selected_deities: selectedDeities, // Store all selected
        reminder_time: reminderTime,
        soundscape_default_on: soundscapeOn,
        soundscape_type: 'temple_bells',
        weekday_mapping_enabled: true,
      };
      
      const preferences = await createPreferences(prefsData);
      console.log('Preferences created:', preferences);
      
      // Initialize streak
      const streakData = await initStreak(userData.id);
      console.log('Streak initialized:', streakData);
      
      // Schedule notification
      await scheduleNotification(reminderTime);
      
      // Save to store and AsyncStorage
      setUser(userData);
      setPreferences(preferences);
      setStreak(streakData);
      setHasCompletedOnboarding(true);
      
      await AsyncStorage.setItem('onboarding_complete', 'true');
      await AsyncStorage.setItem('user_id', userData.id);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      await AsyncStorage.setItem('preferences_data', JSON.stringify(preferences));
      await AsyncStorage.setItem('streak_data', JSON.stringify(streakData));
      
      // Navigate to home
      router.replace('/home');
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Ionicons name="time-outline" size={48} color="#FF6B35" style={styles.icon} />
          
          <Text style={styles.title}>Set Your Morning Reminder</Text>
          <Text style={styles.subtitle}>What time would you like to begin your morning darshan every day?</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminder Time</Text>
            <View style={styles.timeGrid}>
              {timeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeCard,
                    reminderTime === time && styles.timeCardSelected
                  ]}
                  onPress={() => setReminderTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    reminderTime === time && styles.timeTextSelected
                  ]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Helpful nudge message */}
            <View style={styles.nudgeContainer}>
              <Ionicons name="bulb-outline" size={20} color="#FF6B35" />
              <View style={styles.nudgeTextContainer}>
                <Text style={styles.nudgeText}>
                  <Text style={styles.nudgeBold}>Tip: </Text>
                  We recommend setting your darshan within one hour of waking up for the best spiritual experience.{' '}
                  <Text style={styles.nudgeHighlight}>Your reminder is set for {reminderTime}</Text>
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.toggleRow}
              onPress={() => setSoundscapeOn(!soundscapeOn)}
            >
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Play temple soundscape at start</Text>
                <Text style={styles.toggleSubtitle}>Gentle bells and ambient sounds</Text>
              </View>
              <View style={[
                styles.toggle,
                soundscapeOn && styles.toggleActive
              ]}>
                <View style={[
                  styles.toggleThumb,
                  soundscapeOn && styles.toggleThumbActive
                ]} />
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSaveAndContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Save & Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B4423',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  timeCard: {
    width: '30%',
    margin: '1.5%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE4D6',
  },
  timeCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF3ED',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B4423',
  },
  timeTextSelected: {
    color: '#FF6B35',
  },
  nudgeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9F5',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  nudgeTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  nudgeText: {
    fontSize: 14,
    color: '#6B4423',
    lineHeight: 20,
  },
  nudgeBold: {
    fontWeight: '700',
    color: '#2C1810',
  },
  nudgeHighlight: {
    fontWeight: '600',
    color: '#FF6B35',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE4D6',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#8B6F47',
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4B5A0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#FF6B35',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#D4B5A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
