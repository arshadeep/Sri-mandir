import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { playOmChant, stopOmChant } from '../../utils/audioManager';
import { useUserStore } from '../../store/userStore';
import { DEITIES } from '../../utils/constants';
import { getTodaysDeity } from '../../utils/deityRotation';

const BREATHING_DURATION = 15; // 15 seconds

interface Sparkle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

interface DiyaFlame {
  id: number;
  position: number;
  flicker: Animated.Value;
  glow: Animated.Value;
}

const DEVOTIONAL_MESSAGES = [
  "Close your eyes, remember your chosen deity",
  "Feel the divine presence within you",
  "Let peace fill your heart with each breath",
  "Connect with the sacred energy around you",
  "Your devotion brings you closer to the divine",
];

export default function Breathing() {
  const router = useRouter();
  const { preferences } = useUserStore();
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [diyas, setDiyas] = useState<DiyaFlame[]>([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const smokeAnim = useRef(new Animated.Value(0)).current;
  const buttonGlowAnim = useRef(new Animated.Value(0)).current;
  const sparkleIdRef = useRef(0);

  // Get today's deity
  const selectedDeities = preferences?.selected_deities || [preferences?.primary_deity] || ['ganesha'];
  const todaysDeityId = getTodaysDeity(selectedDeities);
  const todaysDeity = DEITIES.find(d => d.id === todaysDeityId) || DEITIES[0];

  // Fill animation - from 0% to 100% over 15 seconds
  useEffect(() => {
    const fillInterval = setInterval(() => {
      setFillPercentage(prev => {
        if (prev >= 100) {
          setIsReady(true);
          clearInterval(fillInterval);
          return 100;
        }
        return prev + (100 / 150); // 150 updates over 15 seconds
      });
    }, 100);

    return () => clearInterval(fillInterval);
  }, []);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % DEVOTIONAL_MESSAGES.length);
    }, 6000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    let soundPlayed = false;

    const breathingCycle = () => {
      setPhase('inhale');
      soundPlayed = false;

      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setPhase('exhale');

        if (!soundPlayed) {
          soundPlayed = true;
          playOmChant();
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();

        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        });
      });
    };

    breathingCycle();
    breathingInterval = setInterval(breathingCycle, 9000);

    return () => {
      clearInterval(breathingInterval);
    };
  }, []);

  // Initialize diyas at the bottom
  useEffect(() => {
    const initialDiyas: DiyaFlame[] = [0, 1, 2, 3, 4].map(i => ({
      id: i,
      position: i,
      flicker: new Animated.Value(1),
      glow: new Animated.Value(0.8),
    }));
    setDiyas(initialDiyas);

    // Animate each diya with a flicker effect
    initialDiyas.forEach((diya, index) => {
      setTimeout(() => {
        const flickerAnimation = () => {
          Animated.sequence([
            Animated.timing(diya.flicker, {
              toValue: 1.2 + Math.random() * 0.3,
              duration: 300 + Math.random() * 200,
              useNativeDriver: true,
            }),
            Animated.timing(diya.flicker, {
              toValue: 0.9 + Math.random() * 0.2,
              duration: 300 + Math.random() * 200,
              useNativeDriver: true,
            }),
          ]).start(() => flickerAnimation());
        };

        const glowAnimation = () => {
          Animated.sequence([
            Animated.timing(diya.glow, {
              toValue: 1,
              duration: 800 + Math.random() * 400,
              useNativeDriver: true,
            }),
            Animated.timing(diya.glow, {
              toValue: 0.6 + Math.random() * 0.2,
              duration: 800 + Math.random() * 400,
              useNativeDriver: true,
            }),
          ]).start(() => glowAnimation());
        };

        flickerAnimation();
        glowAnimation();
      }, index * 200);
    });
  }, []);

  // Create sparkles continuously
  useEffect(() => {
    const createSparkle = () => {
      const id = sparkleIdRef.current++;
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 60;
      const startX = Math.cos(angle) * 60;
      const startY = Math.sin(angle) * 60;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      const sparkle: Sparkle = {
        id,
        x: new Animated.Value(startX),
        y: new Animated.Value(startY),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.5),
      };

      setSparkles(prev => [...prev, sparkle]);

      Animated.parallel([
        Animated.timing(sparkle.x, {
          toValue: endX,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkle.y, {
          toValue: endY,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(sparkle.opacity, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(sparkle.opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(sparkle.scale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle.scale, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setSparkles(prev => prev.filter(s => s.id !== id));
      });
    };

    const sparkleInterval = setInterval(createSparkle, 400);
    return () => clearInterval(sparkleInterval);
  }, []);

  // Ambient glow animation
  useEffect(() => {
    const glowLoop = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => glowLoop());
    };
    glowLoop();
  }, []);

  // Incense smoke animation
  useEffect(() => {
    const smokeLoop = () => {
      Animated.sequence([
        Animated.timing(smokeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(smokeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => smokeLoop());
    };
    smokeLoop();
  }, []);

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

  const handleContinue = () => {
    if (!isReady) return;
    stopOmChant();
    router.replace('/ritual/darshan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Breathe & Chant "ॐ"</Text>
        <Text style={styles.subtitle}>
          Take slow, deep breaths. On each exhale, softly chant "ॐ".
        </Text>

        <View style={styles.breathingContainer}>
          {/* Ambient glow behind the breathing circle */}
          <Animated.View
            style={[
              styles.ambientGlow,
              {
                opacity: glowAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          />

          {/* Main breathing circle */}
          <Animated.View
            style={[
              styles.breathingCircle,
              { transform: [{ scale: scaleAnim }] }
            ]}
          />

          {/* Sparkles floating around */}
          {sparkles.map((sparkle) => (
            <Animated.View
              key={sparkle.id}
              style={[
                styles.sparkle,
                {
                  opacity: sparkle.opacity,
                  transform: [
                    { translateX: sparkle.x },
                    { translateY: sparkle.y },
                    { scale: sparkle.scale },
                  ],
                },
              ]}
            >
              <Ionicons name="sparkles" size={16} color="#FFD700" />
            </Animated.View>
          ))}

          {/* Om symbol */}
          <Animated.Text style={[styles.omSymbol, { opacity: fadeAnim }]}>
            ॐ
          </Animated.Text>

          {/* Incense smoke effect */}
          <Animated.View
            style={[
              styles.smokeLeft,
              {
                opacity: smokeAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.6, 0],
                }),
                transform: [{
                  translateY: smokeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                }],
              },
            ]}
          >
            <Text style={styles.smokeText}>~</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.smokeRight,
              {
                opacity: smokeAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.6, 0],
                }),
                transform: [{
                  translateY: smokeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                }],
              },
            ]}
          >
            <Text style={styles.smokeText}>~</Text>
          </Animated.View>

          <Text style={styles.phaseText}>
            {phase === 'inhale' ? 'Inhale...' : 'Exhale... "ॐ"'}
          </Text>
        </View>

        {/* Diyas at the bottom */}
        <View style={styles.diyaContainer}>
          {diyas.map((diya) => (
            <Animated.View
              key={diya.id}
              style={[
                styles.diya,
                {
                  transform: [{ scaleY: diya.flicker }],
                },
              ]}
            >
              <Animated.View style={{ opacity: diya.glow }}>
                <Ionicons name="flame" size={32} color="#FF6B35" />
              </Animated.View>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.devotionalMessage}>{DEVOTIONAL_MESSAGES[currentMessage]}</Text>

        <View style={styles.spacer} />

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
            {todaysDeity.name} Darshan →
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
    justifyContent: 'center',
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
    marginBottom: 48,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    position: 'relative',
  },
  ambientGlow: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFD700',
    opacity: 0.2,
    position: 'absolute',
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6B35',
    opacity: 0.3,
    position: 'absolute',
  },
  sparkle: {
    position: 'absolute',
    zIndex: 5,
  },
  omSymbol: {
    fontSize: 72,
    color: '#FF6B35',
    fontWeight: '700',
    position: 'absolute',
    zIndex: 3,
  },
  smokeLeft: {
    position: 'absolute',
    left: 40,
    bottom: -20,
    zIndex: 1,
  },
  smokeRight: {
    position: 'absolute',
    right: 40,
    bottom: -20,
    zIndex: 1,
  },
  smokeText: {
    fontSize: 48,
    color: '#C4A57B',
    fontWeight: '300',
  },
  phaseText: {
    marginTop: 160,
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6B35',
    zIndex: 2,
  },
  diyaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 16,
  },
  diya: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  devotionalMessage: {
    fontSize: 16,
    color: '#6B4423',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  spacer: {
    height: 40,
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
    fontSize: 18,
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
