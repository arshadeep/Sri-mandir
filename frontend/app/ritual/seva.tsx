import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SEVA_OPTIONS = [
  {
    id: 'cow',
    title: 'गायों को खिलाएं',
    icon: '🐄',
    description: 'पवित्र गायों के लिए पौष्टिक भोजन प्रदान करें',
  },
  {
    id: 'tree',
    title: 'पेड़ लगाएं',
    icon: '🌳',
    description: 'एक हरित कल बनाने में मदद करें',
  },
  {
    id: 'prasad',
    title: 'प्रसाद अर्पित करें',
    icon: '🙏',
    description: 'मंदिरों में भक्तों को प्रसाद खिलाएं',
  },
];

export default function Seva() {
  const router = useRouter();
  const [selectedSeva, setSelectedSeva] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
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
  
  const amount = customAmount ? `₹${customAmount}` : '₹1';

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
            <Text style={styles.confirmationTitle}>सेवा पूर्ण</Text>
            <Text style={styles.confirmationMessage}>
              {sevaOption?.title} में योगदान के लिए धन्यवाद। आपकी भक्ति और उदारता कई लोगों की मदद करेगी।
            </Text>
          </View>
        </View>
      )}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.heartEmoji}>💛</Text>
        </View>
        
        <Text style={styles.title}>आज सेवा करें</Text>
        <Text style={styles.subtitle}>
          दूसरों की सेवा करना भक्ति का एक रूप है। (वैकल्पिक)
        </Text>

        <Text style={styles.questionText}>
          क्या आप आज इसमें योगदान करना चाहेंगे:
        </Text>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>राशि दर्ज करें (₹)</Text>
          <TextInput
            style={styles.amountInput}
            value={customAmount}
            onChangeText={setCustomAmount}
            placeholder="1"
            keyboardType="numeric"
            placeholderTextColor="#8B6F47"
          />
        </View>
        
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
            <Text style={styles.donateButtonText}>योगदान दें {amount}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>आज नहीं</Text>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
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
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  confirmationEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 12,
  },
  confirmationMessage: {
    fontSize: 16,
    color: '#6B4423',
    textAlign: 'center',
    lineHeight: 24,
  },
  amountSection: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 12,
  },
  amountInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFE4D6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
  },
});
