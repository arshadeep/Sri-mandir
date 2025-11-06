import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BREATHING_DURATION = 30; // 30 seconds

export default function Breathing() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [timeLeft, setTimeLeft] = useState(BREATHING_DURATION);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Breathing animation cycle (4 seconds per cycle)
    const breathingCycle = () => {
      // Inhale (2 seconds)
      setPhase('inhale');
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        // Exhale (2 seconds)
        setPhase('exhale');
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      });
    };

    breathingCycle();
    const interval = setInterval(breathingCycle, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    router.push({
      pathname: '/ritual/darshan',
      params: { soundscape_on: params.soundscape_on }
    });
  };

  const canContinue = timeLeft === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Breathe & Center</Text>
        <Text style={styles.subtitle}>
          Let's take a few breaths together to begin your morning with calm and clarity.
        </Text>
        
        <View style={styles.breathingContainer}>
          <Animated.View 
            style={[
              styles.breathingCircle,
              { transform: [{ scale: scaleAnim }] }
            ]}
          />
          <Text style={styles.phaseText}>
            {phase === 'inhale' ? 'Inhale...' : 'Exhale...'}
          </Text>
        </View>
        
        <Text style={styles.timer}>{timeLeft}s</Text>
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          style={[
            styles.button,
            !canContinue && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.buttonText}>
            {canContinue ? 'Continue' : `Wait ${timeLeft}s...`}
          </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B4423',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6B35',
    opacity: 0.3,
  },
  phaseText: {
    marginTop: 32,
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6B35',
  },
  timer: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B6F47',
    textAlign: 'center',
    marginTop: 24,
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
  buttonDisabled: {
    backgroundColor: '#D4B5A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
