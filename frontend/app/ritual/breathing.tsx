import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { playOmChant } from '../../utils/audioManager';
import { useUserStore } from '../../store/userStore';
import { DEITIES } from '../../utils/constants';
import { getTodaysDeity } from '../../utils/deityRotation';

const BREATHING_DURATION = 15; // 15 seconds

const DEVOTIONAL_MESSAGES = [
  "Close your eyes, remember your chosen deity",
  "Feel the divine presence within you",
  "Let peace fill your heart with each breath",
  "Connect with the sacred energy around you",
  "Your devotion brings you closer to the divine",
];

export default function Breathing() {
  const router = useRouter();
  const { preferences } = useUserStore();
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get today's deity
  const selectedDeities = preferences?.selected_deities || [preferences?.primary_deity] || ['ganesha'];
  const todaysDeityId = getTodaysDeity(selectedDeities);
  const todaysDeity = DEITIES.find(d => d.id === todaysDeityId) || DEITIES[0];

  // Fill animation - from 0% to 100% over 15 seconds
  useEffect(() => {
    const fillInterval = setInterval(() => {
      setFillPercentage(prev => {
        if (prev >= 100) {
          setIsReady(true);
          clearInterval(fillInterval);
          return 100;
        }
        return prev + (100 / 150); // 150 updates over 15 seconds
      });
    }, 100);

    return () => clearInterval(fillInterval);
  }, []);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % DEVOTIONAL_MESSAGES.length);
    }, 6000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    let soundPlayed = false;
    
    const breathingCycle = () => {
      setPhase('inhale');
      soundPlayed = false;
      
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setPhase('exhale');
        
        if (!soundPlayed) {
          soundPlayed = true;
          playOmChant();
        }
        
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
    breathingInterval = setInterval(breathingCycle, 4000);

    return () => clearInterval(breathingInterval);
  }, []);

  const handleContinue = () => {
    if (!isReady) return;
    router.replace('/ritual/darshan');
  };

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
        
        <Text style={styles.devotionalMessage}>{DEVOTIONAL_MESSAGES[currentMessage]}</Text>
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          style={[
            styles.liquidButton,
            !isReady && styles.liquidButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!isReady}
        >
          <View 
            style={[
              styles.liquidFill,
              { height: `${fillPercentage}%` }
            ]}
          />
          <Text style={styles.buttonText}>
            {isReady ? `${todaysDeity.name} Darshan →` : `Preparing... ${Math.floor(fillPercentage)}%`}
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
  devotionalMessage: {
    fontSize: 16,
    color: '#6B4423',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  spacer: {
    height: 40,
  },
  liquidButton: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FF6B35',
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  liquidButtonDisabled: {
    opacity: 0.9,
  },
  liquidFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    opacity: 0.8,
  },
  buttonText: {
    color: '#2C1810',
    fontSize: 18,
    fontWeight: '700',
    zIndex: 1,
  },
});
