import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/userStore';
import { getRitualHistory } from '../services/api';
import { Calendar } from 'react-native-calendars';
import { MILESTONES } from '../utils/constants';

export default function Streaks() {
  const router = useRouter();
  const { user, streak } = useUserStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<any>({});

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      if (user?.id) {
        const historyData = await getRitualHistory(user.id);
        setHistory(historyData);
        
        // Mark completed dates on calendar
        const marked: any = {};
        historyData.forEach((item: any) => {
          if (item.completed) {
            marked[item.date] = {
              marked: true,
              selected: true,
              selectedColor: '#FF6B35',
            };
          }
        });
        setMarkedDates(marked);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextMilestone = () => {
    const current = streak?.current_streak || 0;
    return MILESTONES.find(m => m > current) || MILESTONES[MILESTONES.length - 1];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Streaks</Text>
        <View style={styles.backButton} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Streak Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={48} color="#FF6B35" />
              <Text style={styles.statNumber}>{streak?.current_streak || 0}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={48} color="#FFB300" />
              <Text style={styles.statNumber}>{streak?.longest_streak || 0}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>
          </View>
          
          {/* Next Milestone */}
          <View style={styles.milestoneCard}>
            <Text style={styles.milestoneTitle}>Next Milestone</Text>
            <View style={styles.milestoneProgress}>
              <Text style={styles.milestoneText}>Day {getNextMilestone()}</Text>
              <Text style={styles.milestoneSubtext}>
                {getNextMilestone() - (streak?.current_streak || 0)} days to go
              </Text>
            </View>
          </View>
          
          {/* Calendar */}
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>Your Devotion Journey</Text>
            <Calendar
              markedDates={markedDates}
              theme={{
                backgroundColor: '#FFF8F0',
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#2C1810',
                selectedDayBackgroundColor: '#FF6B35',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#FF6B35',
                dayTextColor: '#2C1810',
                textDisabledColor: '#D4B5A0',
                dotColor: '#FF6B35',
                selectedDotColor: '#FFFFFF',
                arrowColor: '#FF6B35',
                monthTextColor: '#2C1810',
                textDayFontWeight: '500',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 14,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 12,
              }}
              style={styles.calendar}
            />
          </View>
          
          <Text style={styles.motivationText}>
            Consistency strengthens devotion. Keep going!
          </Text>
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
  statsSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C1810',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B6F47',
    textAlign: 'center',
  },
  milestoneCard: {
    backgroundColor: '#FFF3ED',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD4B8',
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B6F47',
    marginBottom: 8,
  },
  milestoneProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
  milestoneSubtext: {
    fontSize: 14,
    color: '#6B4423',
  },
  calendarSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  motivationText: {
    fontSize: 14,
    color: '#8B6F47',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
