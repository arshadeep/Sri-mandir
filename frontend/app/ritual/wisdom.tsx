import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { DEITIES } from '../../utils/constants';

// Wisdom stories for each deity
const WISDOM_STORIES: { [key: string]: Array<{ story: string; takeaway: string }> } = {
  ganesha: [
    {
      story: 'When Ganesha wrote the Mahabharata for Vyasa, he never stopped writing, showing complete dedication. His focus never wavered, demonstrating that obstacles dissolve when we commit fully.',
      takeaway: 'Today, give your full attention to one important task. Let focus be your strength.',
    },
    {
      story: 'Ganesha chose wisdom over worldly riches when tested. He valued knowledge and inner growth above all material gains.',
      takeaway: 'Today, choose growth over comfort. Learn something new.',
    },
  ],
  hanuman: [
    {
      story: 'When Hanuman reached Lanka, he kept his mind steady and heart humble, trusting purpose over fear. His devotion gave him courage beyond measure.',
      takeaway: 'Today, act with courage and humility. Trust in your purpose.',
    },
    {
      story: 'Hanuman carried an entire mountain when he could not find the herb. His determination to serve knew no limits.',
      takeaway: 'Today, go the extra mile for someone you care about.',
    },
  ],
  shiva: [
    {
      story: 'When the world was consumed by poison, Shiva held it in his throat, neither swallowing nor spitting it out. He transformed poison into power through acceptance.',
      takeaway: 'Today, accept challenges with grace. Transform difficulty into strength.',
    },
    {
      story: 'Shiva dances in stillness, showing that true power lies in calmness. In his meditation, he finds infinite energy.',
      takeaway: 'Today, find a moment of stillness. Let calm be your power.',
    },
  ],
  durga: [
    {
      story: 'When darkness threatened the world, Durga rose with fierce compassion. She fought not from anger, but from love for all beings.',
      takeaway: 'Today, stand up for what is right. Let compassion guide your strength.',
    },
    {
      story: 'Durga rides the lion, showing that we must master our own inner nature before we can protect others.',
      takeaway: 'Today, master your emotions. Be both strong and composed.',
    },
  ],
  krishna: [
    {
      story: 'Krishna taught Arjuna that duty done with a joyful heart brings liberation. Work becomes play when done with love.',
      takeaway: 'Today, bring joy to your responsibilities. Find delight in what you do.',
    },
    {
      story: 'Krishna danced in the storm, showing that true wisdom is knowing when to be serious and when to celebrate life.',
      takeaway: 'Today, find a reason to celebrate. Balance work with joy.',
    },
  ],
};

export default function Wisdom() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { preferences } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [wisdom, setWisdom] = useState<{ story: string; takeaway: string } | null>(null);

  useEffect(() => {
    loadWisdom();
  }, []);

  const loadWisdom = async () => {
    try {
      const deityId = preferences?.primary_deity || 'ganesha';
      const stories = WISDOM_STORIES[deityId] || WISDOM_STORIES.ganesha;
      const randomStory = stories[Math.floor(Math.random() * stories.length)];
      setWisdom(randomStory);
    } catch (error) {
      console.error('Error loading wisdom:', error);
      setWisdom({
        story: 'Remember that every challenge is an opportunity to grow stronger and wiser.',
        takeaway: 'Today, embrace challenges as gifts for your growth.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push({
      pathname: '/ritual/closure',
      params: { soundscape_on: params.soundscape_on }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  const deity = DEITIES.find(d => d.id === preferences?.primary_deity) || DEITIES[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={48} color="#FF6B35" />
          </View>
          
          <Text style={styles.title}>Today's Wisdom from {deity.name}</Text>
          <Text style={styles.titleHindi}>({deity.nameHindi})</Text>
          
          <View style={styles.storyCard}>
            <Text style={styles.storyLabel}>Story</Text>
            <Text style={styles.storyText}>{wisdom?.story}</Text>
          </View>
          
          <View style={styles.takeawayCard}>
            <Ionicons name="bulb" size={24} color="#FF6B35" style={styles.takeawayIcon} />
            <View style={styles.takeawayContent}>
              <Text style={styles.takeawayLabel}>Today's Takeaway</Text>
              <Text style={styles.takeawayText}>{wisdom?.takeaway}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleContinue}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C1810',
    textAlign: 'center',
  },
  titleHindi: {
    fontSize: 18,
    color: '#8B6F47',
    textAlign: 'center',
    marginBottom: 32,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFE4D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 12,
    letterSpacing: 1,
  },
  storyText: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 26,
  },
  takeawayCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3ED',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#FFD4B8',
  },
  takeawayIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  takeawayContent: {
    flex: 1,
  },
  takeawayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 8,
    letterSpacing: 1,
  },
  takeawayText: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 24,
    fontWeight: '600',
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
