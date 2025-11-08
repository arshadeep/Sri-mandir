import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { getRandomBlessing } from '../../services/api';

export default function Blessing() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { preferences } = useUserStore();
  const [blessing, setBlessing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlessing();
  }, []);

  const loadBlessing = async () => {
    try {
      const blessingData = await getRandomBlessing(preferences?.primary_deity);
      setBlessing(blessingData);
    } catch (error) {
      console.error('Error loading blessing:', error);
      setBlessing({
        text_en: 'May divine grace guide and protect you throughout your day.',
        tone: 'calm'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push({
      pathname: '/ritual/closure',
      params: { soundscape_on: params.soundscape_on }
    });
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
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={60} color="#FF6B35" />
        </View>
        
        <Text style={styles.title}>Today's Blessing</Text>
        <Text style={styles.subtitle}>Your blessing for today:</Text>
        
        <View style={styles.blessingCard}>
          <Text style={styles.blessingText}>"{blessing.text_en}"</Text>
        </View>
        
        <Text style={styles.footerText}>
          Carry this intention with you as you go through your day.
        </Text>
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8B6F47',
    textAlign: 'center',
    marginBottom: 32,
  },
  blessingCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFE4D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  blessingText: {
    fontSize: 18,
    color: '#2C1810',
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  },
  footerText: {
    fontSize: 14,
    color: '#8B6F47',
    textAlign: 'center',
    lineHeight: 20,
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
