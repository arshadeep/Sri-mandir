import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SEVA_OPTIONS = [
  {
    id: 'cow',
    title: 'Feed Cows',
    icon: '🐄',
    description: 'Provide nutritious food for sacred cows',
  },
  {
    id: 'tree',
    title: 'Plant a Tree',
    icon: '🌳',
    description: 'Help create a greener tomorrow',
  },
  {
    id: 'prasad',
    title: 'Offer Prasad',
    icon: '🙏',
    description: 'Feed prasad to devotees at temples',
  },
];

export default function Seva() {
  const router = useRouter();
  const [selectedSeva, setSelectedSeva] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDonate = () => {
    if (!selectedSeva) {
      return;
    }

    setShowConfirmation(true);
    
    setTimeout(() => {
      router.replace('/home');
    }, 2500);
  };

  const handleSkip = () => {
    router.replace('/home');
  };

  const sevaOption = SEVA_OPTIONS.find(s => s.id === selectedSeva);

  return (
    <SafeAreaView style={styles.container}>
      {showConfirmation && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationEmoji}>🙏</Text>
            <Text style={styles.confirmationTitle}>Seva Complete</Text>
            <Text style={styles.confirmationMessage}>
              Thank you for contributing to {sevaOption?.title}. Your devotion and generosity will help many.
            </Text>
          </View>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.heartEmoji}>💛</Text>
        </View>
        
        <Text style={styles.title}>Do Seva Today</Text>
        <Text style={styles.subtitle}>
          Serving others is also a form of devotion.
        </Text>
        
        <Text style={styles.questionText}>
          Would you like to contribute ₹1 today towards:
        </Text>
        
        <View style={styles.sevaOptions}>
          {SEVA_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sevaCard,
                selectedSeva === option.id && styles.sevaCardSelected
              ]}
              onPress={() => setSelectedSeva(option.id)}
            >
              <View style={styles.sevaIcon}>
                <Text style={styles.sevaEmoji}>{option.icon}</Text>
              </View>
              <View style={styles.sevaInfo}>
                <Text style={styles.sevaTitle}>{option.title}</Text>
                <Text style={styles.sevaDescription}>{option.description}</Text>
              </View>
              <View style={[
                styles.radio,
                selectedSeva === option.id && styles.radioSelected
              ]}>
                {selectedSeva === option.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.donateButton,
              !selectedSeva && styles.donateButtonDisabled
            ]}
            onPress={handleDonate}
            disabled={!selectedSeva}
          >
            <Ionicons name="heart" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.donateButtonText}>Contribute ₹1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Not Today</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heartEmoji: {
    fontSize: 64,
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
    color: '#6B4423',
    textAlign: 'center',
    marginBottom: 32,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 20,
  },
  sevaOptions: {
    marginBottom: 32,
    gap: 12,
  },
  sevaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE4D6',
  },
  sevaCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF3ED',
  },
  sevaIcon: {
    marginRight: 16,
  },
  sevaEmoji: {
    fontSize: 32,
  },
  sevaInfo: {
    flex: 1,
  },
  sevaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  sevaDescription: {
    fontSize: 13,
    color: '#8B6F47',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4B5A0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#FF6B35',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
  },
  buttonContainer: {
    gap: 12,
  },
  donateButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  donateButtonDisabled: {
    backgroundColor: '#D4B5A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE4D6',
  },
  skipButtonText: {
    color: '#8B6F47',
    fontSize: 16,
    fontWeight: '600',
  },
});
