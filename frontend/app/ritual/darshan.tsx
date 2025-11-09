import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, Dimensions, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { DEITY_IMAGES, DEITIES } from '../../utils/constants';
import { playTempleBells, playBellSound } from '../../utils/audioManager';
import { getTodaysDeity } from '../../utils/deityRotation';

const { width } = Dimensions.get('window');

interface FlowerParticle {
  id: number;
  x: number;
  left: Animated.Value;
  top: Animated.Value;
  rotation: Animated.Value;
  opacity: Animated.Value;
}

interface DiyaParticle {
  id: number;
  x: number;
  bottom: Animated.Value;
  opacity: Animated.Value;
}

export default function Darshan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { preferences } = useUserStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [flowers, setFlowers] = useState<FlowerParticle[]>([]);
  const [diyas, setDiyas] = useState<DiyaParticle[]>([]);
  const [flowerOffered, setFlowerOffered] = useState(false);
  const [diyaLit, setDiyaLit] = useState(false);
  const [bellRung, setBellRung] = useState(false);
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const flowerIdRef = useRef(0);
  const diyaIdRef = useRef(0);
  const buttonGlowAnim = useRef(new Animated.Value(0)).current;

  // Get today's deity
  const selectedDeities = preferences?.selected_deities || [preferences?.primary_deity] || ['ganesha'];
  const todaysDeityId = getTodaysDeity(selectedDeities);
  const deity = DEITIES.find(d => d.id === todaysDeityId) || DEITIES[0];
  const deityImages = DEITY_IMAGES[todaysDeityId] || DEITY_IMAGES.ganesha;

  // Removed auto-play of temple bells on screen load

  // Fill animation - from 0% to 100% over 5 seconds
  useEffect(() => {
    const fillInterval = setInterval(() => {
      setFillPercentage(prev => {
        if (prev >= 100) {
          setIsReady(true);
          clearInterval(fillInterval);
          return 100;
        }
        return prev + (100 / 50); // 50 updates over 5 seconds
      });
    }, 100);

    return () => clearInterval(fillInterval);
  }, []);

  // Auto-scroll images every 15 seconds
  useEffect(() => {
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
  }, [deityImages]);

  // Button prominence animation when ready
  useEffect(() => {
    if (isReady) {
      const glowLoop = () => {
        Animated.sequence([
          Animated.timing(buttonGlowAnim, {
            toValue: 0.4,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(buttonGlowAnim, {
            toValue: 0.2,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]).start(() => glowLoop());
      };

      glowLoop();
    }
  }, [isReady]);

  const offerFlower = () => {
    if (!flowerOffered) {
      setFlowerOffered(true);
    }
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const id = flowerIdRef.current++;
        const randomX = Math.random() * (width - 100);
        const left = new Animated.Value(randomX);
        const top = new Animated.Value(-50);
        const rotation = new Animated.Value(0);
        const opacity = new Animated.Value(1);

        const newFlower: FlowerParticle = { id, x: randomX, left, top, rotation, opacity };
        
        setFlowers(prev => [...prev, newFlower]);

        Animated.parallel([
          Animated.timing(top, {
            toValue: 200 + Math.random() * 150,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: false,
          }),
          Animated.timing(rotation, {
            toValue: 360,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.delay(2000),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
          ]),
        ]).start(() => {
          setFlowers(prev => prev.filter(f => f.id !== id));
        });
      }, i * 200);
    }
  };

  const lightDiya = () => {
    if (!diyaLit) {
      setDiyaLit(true);
    }
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const id = diyaIdRef.current++;
        const randomX = 50 + i * 80;
        const bottom = new Animated.Value(-50);
        const opacity = new Animated.Value(0);

        const newDiya: DiyaParticle = { id, x: randomX, bottom, opacity };
        
        setDiyas(prev => [...prev, newDiya]);

        Animated.parallel([
          Animated.timing(bottom, {
            toValue: 100,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]).start();
      }, i * 300);
    }
  };

  const ringBell = () => {
    setBellRung(true);
    playBellSound();
  };

  const handleContinue = () => {
    if (!isReady) return;
    
    router.push({
      pathname: '/ritual/wisdom',
      params: { soundscape_on: params.soundscape_on }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Image Carousel with Overlay Animations */}
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

          {/* Falling Flowers Animation */}
          {flowers.map((flower) => (
            <Animated.View
              key={flower.id}
              style={[
                styles.flowerParticle,
                {
                  left: flower.left,
                  top: flower.top,
                  opacity: flower.opacity,
                  transform: [
                    {
                      rotate: flower.rotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.flowerEmoji}>🌺</Text>
            </Animated.View>
          ))}

          {/* Diyas at Bottom */}
          {diyas.map((diya) => (
            <Animated.View
              key={diya.id}
              style={[
                styles.diyaParticle,
                {
                  left: diya.x,
                  bottom: diya.bottom,
                  opacity: diya.opacity,
                },
              ]}
            >
              <Ionicons name="flame" size={40} color="#FF6B35" />
            </Animated.View>
          ))}
        </View>
        
        {/* Offering Buttons */}
        <View style={styles.offeringsRow}>
          <TouchableOpacity 
            style={[
              styles.offeringButton,
              flowerOffered && styles.offeringButtonUsed
            ]}
            onPress={offerFlower}
          >
            <Text style={styles.offeringEmoji}>🌸</Text>
            <Text style={styles.offeringText}>फूल अर्पित करें</Text>
            {flowerOffered && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark" size={14} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.offeringButton,
              diyaLit && styles.offeringButtonUsed
            ]}
            onPress={lightDiya}
          >
            <Ionicons 
              name={diyaLit ? "flame" : "flame-outline"} 
              size={32} 
              color={diyaLit ? "#FF6B35" : "#FFB88C"} 
            />
            <Text style={styles.offeringText}>दीया जलाएं</Text>
            {diyaLit && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark" size={14} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.offeringButton,
              bellRung && styles.offeringButtonUsed
            ]}
            onPress={ringBell}
          >
            <Ionicons 
              name={bellRung ? "notifications" : "notifications-outline"} 
              size={32} 
              color={bellRung ? "#FFD700" : "#FFE4B5"} 
            />
            <Text style={styles.offeringText}>घंटी बजाएं</Text>
            {bellRung && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark" size={14} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[
            styles.liquidButton,
            !isReady && styles.liquidButtonDisabled,
            isReady && {
              shadowColor: '#FF6B35',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }
          ]}
          onPress={handleContinue}
          disabled={!isReady}
        >
          {/* Animated glow overlay when ready */}
          {isReady && (
            <Animated.View
              style={[
                styles.buttonGlow,
                {
                  opacity: buttonGlowAnim,
                },
              ]}
            />
          )}
          <View
            style={[
              styles.liquidFill,
              { height: `${fillPercentage}%` }
            ]}
          />
          <Text style={[styles.buttonText, isReady && styles.buttonTextReady]}>
            {isReady ? 'आज का ज्ञान →' : 'आशीर्वाद प्राप्त करें'}
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
    paddingTop: 20,
  },
  carouselContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  imageContainer: {
    width: width - 48,
    height: 380,
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
  flowerParticle: {
    position: 'absolute',
    zIndex: 10,
  },
  flowerEmoji: {
    fontSize: 32,
  },
  diyaParticle: {
    position: 'absolute',
    zIndex: 10,
  },
  offeringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  offeringButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE4D6',
    position: 'relative',
  },
  offeringButtonUsed: {
    backgroundColor: '#F1F8F4',
    borderColor: '#4CAF50',
  },
  offeringEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  offeringText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2C1810',
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  liquidButton: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FF6B35',
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  liquidButtonDisabled: {
    opacity: 0.9,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF8C5A',
    opacity: 0.5,
    zIndex: 0,
  },
  liquidFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    opacity: 0.8,
  },
  buttonText: {
    color: '#2C1810',
    fontSize: 16,
    fontWeight: '700',
    zIndex: 1,
  },
  buttonTextReady: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
