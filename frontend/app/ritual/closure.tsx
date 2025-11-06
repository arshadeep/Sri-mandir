import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { completeRitual } from '../../services/api';
import { format } from 'date-fns';

export default function Closure() {
  const router = useRouter();
  const { user, preferences } = useUserStore();
  const [completed, setCompleted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto complete ritual after animation
    setTimeout(() => {
      handleCompleteRitual();
    }, 1500);
  }, []);

  const handleCompleteRitual = async () => {
    if (completed) return;
    
    try {
      const ritualData = {
        user_id: user?.id || '',
        date: format(new Date(), 'yyyy-MM-dd'),
        completed: true,
        steps_completed: 5,
        deity_used: preferences?.primary_deity || 'ganesha',
        soundscape_on: preferences?.soundscape_default_on || false,
        duration_sec: 180, // Approximately 3 minutes
      };

      const response = await completeRitual(ritualData);
      console.log('Ritual completed:', response);
      setCompleted(true);

      // Show milestone if reached
      if (response.milestone) {
        setTimeout(() => {
          Alert.alert(
            '🌼 Milestone Reached! 🌼',
            `Congratulations! You've completed ${response.streak} days of morning darshan. Consistency strengthens devotion.`,
            [{ text: 'Continue', onPress: () => router.replace('/home') }]
          );
        }, 500);
      }
    } catch (error) {
      console.error('Error completing ritual:', error);
      setCompleted(true);
    }
  };

  const handleDone = () => {
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.iconContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Ionicons name="flame" size={100} color="#FF6B35" />
        </Animated.View>
        
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          Ritual Complete
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
          Your morning darshan is complete.
        </Animated.Text>
        
        <Animated.Text style={[styles.blessing, { opacity: fadeAnim }]}>
          May divine grace guide and protect you throughout your day.
        </Animated.Text>
        
        <View style={styles.spacer} />
        
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleDone}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B4423',
    textAlign: 'center',
    marginBottom: 24,
  },
  blessing: {
    fontSize: 16,
    color: '#8B6F47',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  spacer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
