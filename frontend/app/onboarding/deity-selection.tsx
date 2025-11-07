import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { DEITIES } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

export default function DeitySelection() {
  const router = useRouter();
  const [selectedDeities, setSelectedDeities] = useState<string[]>([]);

  const toggleDeity = (deityId: string) => {
    if (selectedDeities.includes(deityId)) {
      setSelectedDeities(selectedDeities.filter(d => d !== deityId));
    } else {
      setSelectedDeities([...selectedDeities, deityId]);
    }
  };

  const handleContinue = () => {
    if (selectedDeities.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one deity.');
      return;
    }
    router.push({
      pathname: '/onboarding/reminder-setup',
      params: { 
        selected_deities: JSON.stringify(selectedDeities)
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Ionicons name="flower-outline" size={48} color="#FF6B35" style={styles.icon} />
          
          <Text style={styles.title}>Choose Your Favorite Gods</Text>
          <Text style={styles.subtitle}>Select one or more deities for your daily darshan</Text>
          
          <View style={styles.section}>
            {DEITIES.map((deity) => (
              <TouchableOpacity
                key={deity.id}
                style={[
                  styles.deityCard,
                  selectedDeities.includes(deity.id) && styles.deityCardSelected
                ]}
                onPress={() => toggleDeity(deity.id)}
              >
                <View style={styles.deityInfo}>
                  <Text style={styles.deityName}>{deity.name}</Text>
                  <Text style={styles.deityNameHindi}>{deity.nameHindi}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  selectedDeities.includes(deity.id) && styles.checkboxSelected
                ]}>
                  {selectedDeities.includes(deity.id) && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedDeities.length > 0 && (
            <Text style={styles.helperText}>
              {selectedDeities.length} {selectedDeities.length === 1 ? 'deity' : 'deities'} selected - Daily rotation will show one deity each day
            </Text>
          )}
          
          <TouchableOpacity 
            style={[
              styles.button,
              selectedDeities.length === 0 && styles.buttonDisabled
            ]}
            onPress={handleContinue}
            disabled={selectedDeities.length === 0}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#8B6F47',
    marginBottom: 16,
  },
  deityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFE4D6',
  },
  deityCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF3ED',
  },
  deityInfo: {
    flex: 1,
  },
  deityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  deityNameHindi: {
    fontSize: 16,
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D4B5A0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 16,
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
    fontWeight: '600',
  },
});
