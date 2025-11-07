import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { DEITY_IMAGES, DEITIES } from '../../utils/constants';

const DARSHAN_DURATION = 60; // 60 seconds
const { width } = Dimensions.get('window');

export default function Darshan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { preferences } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(DARSHAN_DURATION);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

  // Auto-scroll images every 15 seconds
  useEffect(() => {
    const deityImages = DEITY_IMAGES[preferences?.primary_deity || 'ganesha'];
    if (!deityImages || deityImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const nextIndex = (prev + 1) % deityImages.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (width - 48),
          animated: true,
        });
        return nextIndex;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [preferences]);

  const handleContinue = () => {
    router.push({
      pathname: '/ritual/wisdom',
      params: { soundscape_on: params.soundscape_on }
    });
  };

  const canContinue = timeLeft === 0;
  const deity = DEITIES.find(d => d.id === preferences?.primary_deity) || DEITIES[0];
  const deityImages = DEITY_IMAGES[preferences?.primary_deity || 'ganesha'] || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Darshan</Text>
          
          {/* Image Carousel */}
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / (width - 48));
                setCurrentImageIndex(index);
              }}
            >
              {deityImages.map((imageUrl, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image 
                    source={{ uri: imageUrl }}
                    style={styles.deityImage}
                  />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.deityName}>{deity.name}</Text>
                    <Text style={styles.deityNameHindi}>{deity.nameHindi}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {deityImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive
                  ]}
                />
              ))}
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
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 24,
    textAlign: 'center',
  },
  carouselContainer: {
    marginBottom: 24,
  },
  imageContainer: {
    width: width - 48,
    height: 350,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
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
    backgroundColor: 'rgba(44, 24, 16, 0.8)',
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4B5A0',
  },
  paginationDotActive: {
    backgroundColor: '#FF6B35',
    width: 24,
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
    height: 40,
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
