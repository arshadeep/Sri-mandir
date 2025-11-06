import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';

export default function Prepare() {
  const router = useRouter();
  const { preferences } = useUserStore();
  const [soundscapeOn, setSoundscapeOn] = useState(preferences?.soundscape_default_on || true);

  const handleBegin = () => {
    router.push({
      pathname: '/ritual/breathing',
      params: { soundscape_on: soundscapeOn ? 'true' : 'false' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={80} color="#FF6B35" />
        </View>
        
        <Text style={styles.title}>Prepare for Darshan</Text>
        <Text style={styles.subtitle}>
          Take a moment to settle in. When you're ready, we'll begin your morning darshan with calm and devotion.
        </Text>
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          style={styles.toggleRow}
          onPress={() => setSoundscapeOn(!soundscapeOn)}
        >
          <View style={styles.toggleInfo}>
            <Ionicons name="musical-notes" size={24} color="#FF6B35" />
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Temple Soundscape</Text>
              <Text style={styles.toggleSubtitle}>
                {soundscapeOn ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
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
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleBegin}
        >
          <Text style={styles.buttonText}>Begin</Text>
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
    marginBottom: 32,
  },
  spacer: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFE4D6',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleTextContainer: {
    marginLeft: 12,
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
