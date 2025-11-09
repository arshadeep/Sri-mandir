import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../../store/userStore';
import { updatePreferences } from '../../services/api';
import { DEITIES } from '../../utils/constants';

const WEEKDAY_MAP: { [key: string]: string } = {
  'shiva': 'सोमवार',
  'hanuman': 'मंगलवार',
  'ganesha': 'बुधवार',
  'durga': 'शुक्रवार',
  'krishna': 'रविवार',
};

export default function DeityPreferences() {
  const router = useRouter();
  const { user, preferences, setPreferences } = useUserStore();
  const [primaryDeity, setPrimaryDeity] = useState(preferences?.primary_deity || 'ganesha');
  const [secondaryDeities, setSecondaryDeities] = useState<string[]>(preferences?.secondary_deities || []);
  const [loading, setLoading] = useState(false);

  const toggleSecondaryDeity = (deityId: string) => {
    if (deityId === primaryDeity) return;
    
    if (secondaryDeities.includes(deityId)) {
      setSecondaryDeities(secondaryDeities.filter(d => d !== deityId));
    } else {
      if (secondaryDeities.length < 3) {
        setSecondaryDeities([...secondaryDeities, deityId]);
      } else {
        Alert.alert('सीमा पूर्ण', 'आप 3 द्वितीयक देवताओं तक चयन कर सकते हैं।');
      }
    }
  };

  const handleSave = async () => {
    if (!primaryDeity) {
      Alert.alert('चयन आवश्यक', 'कृपया अपना प्राथमिक देवता चुनें।');
      return;
    }

    setLoading(true);
    try {
      const updatedPrefs = {
        ...preferences,
        primary_deity: primaryDeity,
        secondary_deities: secondaryDeities,
      };

      if (user?.id) {
        await updatePreferences(user.id, updatedPrefs);
        
        setPreferences(updatedPrefs);
        await AsyncStorage.setItem('preferences_data', JSON.stringify(updatedPrefs));
        
        Alert.alert('सफलता', 'देवता प्राथमिकताएं सफलतापूर्वक अपडेट हुई।');
        router.back();
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('त्रुटि', 'प्राथमिकताएं अपडेट करने में विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>देवता प्राथमिकताएं</Text>
        <View style={styles.backButton} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>प्राथमिक देवता</Text>
            {DEITIES.map((deity) => (
              <TouchableOpacity
                key={deity.id}
                style={[
                  styles.deityCard,
                  primaryDeity === deity.id && styles.deityCardSelected
                ]}
                onPress={() => setPrimaryDeity(deity.id)}
              >
                <View style={styles.deityInfo}>
                  <Text style={styles.deityName}>{deity.name}</Text>
                  <Text style={styles.deityNameHindi}>{deity.nameHindi}</Text>
                </View>
                <View style={[
                  styles.radio,
                  primaryDeity === deity.id && styles.radioSelected
                ]}>
                  {primaryDeity === deity.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>द्वितीयक देवता (वैकल्पिक)</Text>
            <Text style={styles.helperText}>3 अतिरिक्त देवताओं तक चुनें</Text>
            {DEITIES.filter(d => d.id !== primaryDeity).map((deity) => (
              <TouchableOpacity
                key={deity.id}
                style={[
                  styles.deityCard,
                  secondaryDeities.includes(deity.id) && styles.deityCardSecondary
                ]}
                onPress={() => toggleSecondaryDeity(deity.id)}
              >
                <View style={styles.deityInfo}>
                  <Text style={styles.deityName}>{deity.name}</Text>
                  <Text style={styles.deityNameHindi}>{deity.nameHindi}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  secondaryDeities.includes(deity.id) && styles.checkboxSelected
                ]}>
                  {secondaryDeities.includes(deity.id) && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {secondaryDeities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>सप्ताह के दिन भक्ति मानचित्रण</Text>
              <Text style={styles.helperText}>आपके चुने हुए देवता और उनके विशेष दिन</Text>
              {[primaryDeity, ...secondaryDeities].map((deityId) => {
                const deity = DEITIES.find(d => d.id === deityId);
                const weekday = WEEKDAY_MAP[deityId];
                return weekday ? (
                  <View key={deityId} style={styles.mappingCard}>
                    <Text style={styles.mappingDay}>{weekday}</Text>
                    <Text style={styles.mappingDeity}>{deity?.name} ({deity?.nameHindi})</Text>
                  </View>
                ) : null;
              })}
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>प्राथमिकताएं सहेजें</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4D6',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C1810',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
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
  deityCardSecondary: {
    borderColor: '#FFB88C',
    backgroundColor: '#FFF9F5',
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
  mappingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3ED',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  mappingDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  mappingDeity: {
    fontSize: 14,
    color: '#6B4423',
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
