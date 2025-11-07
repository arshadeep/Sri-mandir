import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { playOmChant } from '../../utils/audioManager';

const BREATHING_DURATION = 30; // 30 seconds

export default function Breathing() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [timeLeft, setTimeLeft] = useState(BREATHING_DURATION);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto navigate after breathing completes
          setTimeout(() => {
            router.push({
              pathname: '/ritual/darshan',
              params: { soundscape_on: 'true' }
            });
          }, 500);
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
        // Exhale (2 seconds) - show Om and play sound
        setPhase('exhale');
        playOmChant(); // Play Om sound on exhale
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        });
      });
    };

    breathingCycle();
    const interval = setInterval(breathingCycle, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Breathe & Chant "ॐ"</Text>
        <Text style={styles.subtitle}>
          Take slow, deep breaths. On each exhale, softly chant "ॐ".
        </Text>
        
        <View style={styles.breathingContainer}>
          <Animated.View 
            style={[
              styles.breathingCircle,
              { transform: [{ scale: scaleAnim }] }
            ]}
          />
          <Animated.Text style={[styles.omSymbol, { opacity: fadeAnim }]}>
            ॐ
          </Animated.Text>
          <Text style={styles.phaseText}>
            {phase === 'inhale' ? 'Inhale...' : 'Exhale... "ॐ"'}
          </Text>
        </View>
        
        <Text style={styles.timer}>{timeLeft}s</Text>
        
        <Text style={styles.helperText}>Connecting with divine energy...</Text>
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
    position: 'absolute',
  },
  omSymbol: {
    fontSize: 72,
    color: '#FF6B35',
    fontWeight: '700',
    position: 'absolute',
  },
  phaseText: {
    marginTop: 160,
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6B35',
  },
  timer: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B6F47',
    textAlign: 'center',
    marginTop: 40,
  },
  helperText: {
    fontSize: 14,
    color: '#8B6F47',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
