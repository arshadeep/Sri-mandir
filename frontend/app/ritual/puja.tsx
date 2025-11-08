import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Puja() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [flowerOffered, setFlowerOffered] = useState(false);
  const [diyaLit, setDiyaLit] = useState(false);
  const [bellRung, setBellRung] = useState(false);

  const handleOfferFlower = () => {
    setFlowerOffered(true);
  };

  const handleLightDiya = () => {
    setDiyaLit(true);
  };

  const handleRingBell = () => {
    setBellRung(true);
  };

  const handleContinue = () => {
    router.push({
      pathname: '/ritual/darshan',
      params: { soundscape_on: params.soundscape_on }
    });
  };

  const canContinue = flowerOffered && diyaLit && bellRung;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Puja Offerings</Text>
        <Text style={styles.subtitle}>
          Offer a flower, light a diya, and ring the bell before darshan.
        </Text>
        
        <View style={styles.offeringsContainer}>
          {/* Flower Offering */}
          <TouchableOpacity 
            style={[
              styles.offeringCard,
              flowerOffered && styles.offeringCardComplete
            ]}
            onPress={handleOfferFlower}
            disabled={flowerOffered}
          >
            <Ionicons 
              name={flowerOffered ? "flower" : "flower-outline"} 
              size={64} 
              color={flowerOffered ? '#FF1493' : '#FFB6C1'} 
            />
            <Text style={styles.offeringText}>Offer Flower</Text>
            {flowerOffered && (
              <View style={styles.checkMark}>
                <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
          
          {/* Diya Lighting */}
          <TouchableOpacity 
            style={[
              styles.offeringCard,
              diyaLit && styles.offeringCardComplete
            ]}
            onPress={handleLightDiya}
            disabled={diyaLit}
          >
            <Ionicons 
              name={diyaLit ? "flame" : "flame-outline"} 
              size={64} 
              color={diyaLit ? '#FF6B35' : '#FFD4B8'} 
            />
            <Text style={styles.offeringText}>Light Diya</Text>
            {diyaLit && (
              <View style={styles.checkMark}>
                <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
          
          {/* Bell Ringing */}
          <TouchableOpacity 
            style={[
              styles.offeringCard,
              bellRung && styles.offeringCardComplete
            ]}
            onPress={handleRingBell}
            disabled={bellRung}
          >
            <Ionicons 
              name={bellRung ? "notifications" : "notifications-outline"} 
              size={64} 
              color={bellRung ? '#FFD700' : '#FFE4B5'} 
            />
            <Text style={styles.offeringText}>Ring Bell</Text>
            {bellRung && (
              <View style={styles.checkMark}>
                <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
        </View>
        
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
            {canContinue ? 'Continue to Darshan' : 'Complete All Offerings'}
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
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B4423',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  offeringsContainer: {
    gap: 20,
  },
  offeringCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFE4D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offeringCardComplete: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  offeringText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
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
