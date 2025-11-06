import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { TEMPLE_IMAGE } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="flower" size={80} color="#FF6B35" />
        </View>
        
        <Text style={styles.title}>Sri Mandir</Text>
        <Text style={styles.subtitle}>A peaceful start to your mornings awaits</Text>
        
        <Image 
          source={{ uri: TEMPLE_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/onboarding/deity-selection')}
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
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B4423',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
  },
  spacer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 28,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
