import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { DEITY_IMAGES, DEITIES } from '../../utils/constants';

const DARSHAN_DURATION = 60; // 60 seconds

export default function Darshan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { preferences } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(DARSHAN_DURATION);

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

  const handleContinue = () => {
    router.push({
      pathname: '/ritual/blessing',
      params: { soundscape_on: params.soundscape_on }
    });
  };

  const canContinue = timeLeft === 0;
  const deity = DEITIES.find(d => d.id === preferences?.primary_deity) || DEITIES[0];
  const deityImage = DEITY_IMAGES[preferences?.primary_deity || 'ganesha'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Darshan</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: deityImage }}
            style={styles.deityImage}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.deityName}>{deity.name}</Text>
            <Text style={styles.deityNameHindi}>{deity.nameHindi}</Text>
          </View>
        </View>
        
        <Text style={styles.devotionText}>
          May this morning bring peace, clarity, and divine grace into your day.
        </Text>
        
        {!canContinue && (
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={20} color="#8B6F47" />
            <Text style={styles.timer}>{timeLeft}s remaining</Text>
          </View>
        )}
        
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
            {canContinue ? 'Continue' : 'Meditating...'}
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
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
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
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(44, 24, 16, 0.7)',
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
  devotionText: {
    fontSize: 16,
    color: '#6B4423',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  timer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B6F47',
    marginLeft: 8,
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
