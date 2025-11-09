import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../../store/userStore';
import { updatePreferences } from '../../services/api';

export default function ReminderSettings() {
  const router = useRouter();
  const { user, preferences, setPreferences } = useUserStore();
  const [reminderTime, setReminderTime] = useState(preferences?.reminder_time || '06:30');
  const [soundscapeOn, setSoundscapeOn] = useState(preferences?.soundscape_default_on || true);
  const [loading, setLoading] = useState(false);

  const timeOptions = [
    '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00'
  ];

  const scheduleNotification = async (time: string) => {
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedPrefs = {
        ...preferences,
        reminder_time: reminderTime,
        soundscape_default_on: soundscapeOn,
      };

      if (user?.id) {
        await updatePreferences(user.id, updatedPrefs);
        await scheduleNotification(reminderTime);
        
        setPreferences(updatedPrefs);
        await AsyncStorage.setItem('preferences_data', JSON.stringify(updatedPrefs));
        
        Alert.alert('Success', 'Reminder settings updated successfully');
        router.back();
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminder Settings</Text>
        <View style={styles.backButton} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
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
            <Text style={styles.sectionTitle}>Audio Settings</Text>
            <TouchableOpacity 
              style={styles.toggleRow}
              onPress={() => setSoundscapeOn(!soundscapeOn)}
            >
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Temple soundscape</Text>
                <Text style={styles.toggleSubtitle}>Play gentle sounds during ritual</Text>
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
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4D6',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C1810',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
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
