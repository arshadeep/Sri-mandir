import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/userStore';
import { getWeekdayDeity, getStreak } from '../services/api';
import { DEITY_IMAGES, DEITIES } from '../utils/constants';
import { getTodaysDeity } from '../utils/deityRotation';

export default function Home() {
  const router = useRouter();
  const { user, preferences, streak, setStreak } = useUserStore();
  const [weekdayInfo, setWeekdayInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const weekdayData = await getWeekdayDeity();
      setWeekdayInfo(weekdayData);
      
      if (user?.id) {
        const streakData = await getStreak(user.id);
        setStreak(streakData);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  // Get today's deity based on rotation
  const selectedDeities = preferences?.selected_deities || [preferences?.primary_deity] || ['ganesha'];
  const todaysDeityId = getTodaysDeity(selectedDeities);
  const todaysDeity = DEITIES.find(d => d.id === todaysDeityId) || DEITIES[0];
  
  const deityImages = DEITY_IMAGES[todaysDeityId];
  const deityImage = deityImages ? deityImages[0] : '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>{user?.name || 'Devotee'}</Text>
            </View>
          </View>
          
          {/* Today's Deity Card */}
          <View style={styles.deityCard}>
            <Image 
              source={{ uri: deityImage }}
              style={styles.deityImage}
            />
            <View style={styles.deityOverlay}>
              <View style={styles.deityInfo}>
                <Text style={styles.deityName}>{todaysDeity?.name}</Text>
                <Text style={styles.deityNameHindi}>{todaysDeity?.nameHindi}</Text>
              </View>
            </View>
          </View>
          
          {/* Today's Devotion Message */}
          <View style={styles.messageCard}>
            <Ionicons name="calendar-outline" size={20} color="#FF6B35" />
            <Text style={styles.messageText}>
              Today is a day of devotion to {todaysDeity?.name} ({todaysDeity?.nameHindi})
            </Text>
          </View>
          
          {/* Begin Darshan Button */}
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/ritual/breathing')}
          >
            <Ionicons name="flower" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Begin Morning Darshan</Text>
          </TouchableOpacity>
          
          {/* Streak Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="flame" size={32} color="#FF6B35" />
              <Text style={styles.infoNumber}>{streak?.current_streak || 0}</Text>
              <Text style={styles.infoLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={32} color="#FF6B35" />
              <Text style={styles.infoNumber}>{preferences?.reminder_time || '06:30'}</Text>
              <Text style={styles.infoLabel}>Daily Reminder</Text>
            </View>
          </View>
          
          {/* Secondary Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/streaks')}
            >
              <Ionicons name="calendar" size={24} color="#FF6B35" />
              <Text style={styles.actionText}>View Streaks</Text>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#8B6F47',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C1810',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deityCard: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  deityImage: {
    width: '100%',
    height: '100%',
  },
  deityOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(44, 24, 16, 0.7)',
  },
  deityInfo: {
    alignItems: 'center',
  },
  deityName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deityNameHindi: {
    fontSize: 20,
    color: '#FFE4D6',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3ED',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFD4B8',
  },
  messageText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#6B4423',
    lineHeight: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C1810',
    marginTop: 8,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8B6F47',
    textAlign: 'center',
  },
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE4D6',
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
});
