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
      story: 'जब गणेश ने व्यास के लिए महाभारत लिखा, तो उन्होंने कभी रुकना नहीं जाना, पूर्ण समर्पण दिखाया। उनका ध्यान कभी नहीं भटका, यह साबित करते हुए कि जब हम पूरी तरह प्रतिबद्ध होते हैं तो बाधाएं घुल जाती हैं।',
      takeaway: 'आज, एक महत्वपूर्ण कार्य पर अपना पूरा ध्यान दें। ध्यान को अपनी ताकत बनाएं।',
    },
    {
      story: 'गणेश ने परीक्षा के समय सांसारिक धन के बजाय ज्ञान को चुना। उन्होंने सभी भौतिक लाभों से ऊपर ज्ञान और आंतरिक विकास को महत्व दिया।',
      takeaway: 'आज, आराम के बजाय विकास चुनें। कुछ नया सीखें।',
    },
  ],
  hanuman: [
    {
      story: 'जब हनुमान लंका पहुंचे, तो उन्होंने अपने मन को स्थिर और हृदय को विनम्र रखा, भय से अधिक उद्देश्य पर विश्वास किया। उनकी भक्ति ने उन्हें अथाह साहस दिया।',
      takeaway: 'आज, साहस और विनम्रता के साथ कार्य करें। अपने उद्देश्य पर विश्वास करें।',
    },
    {
      story: 'हनुमान ने पूरा पहाड़ उठा लिया जब वे जड़ी-बूटी नहीं ढूंढ पाए। सेवा करने का उनका संकल्प असीम था।',
      takeaway: 'आज, किसी ऐसे व्यक्ति के लिए अतिरिक्त प्रयास करें जिसकी आप परवाह करते हैं।',
    },
  ],
  shiva: [
    {
      story: 'जब विष ने संसार को निगलने की कोशिश की, तो शिव ने उसे अपने गले में रोक लिया, न निगला न बाहर फेंका। उन्होंने स्वीकृति के माध्यम से विष को शक्ति में बदल दिया।',
      takeaway: 'आज, चुनौतियों को अनुग्रह के साथ स्वीकार करें। कठिनाई को शक्ति में बदलें।',
    },
    {
      story: 'शिव स्थिरता में नृत्य करते हैं, यह दिखाते हुए कि सच्ची शक्ति शांति में है। अपने ध्यान में, वे अनंत ऊर्जा पाते हैं।',
      takeaway: 'आज, स्थिरता का एक पल खोजें। शांति को अपनी शक्ति बनाएं।',
    },
  ],
  durga: [
    {
      story: 'जब अंधकार ने संसार को धमकी दी, तो दुर्गा उग्र करुणा के साथ उठीं। उन्होंने क्रोध से नहीं, बल्कि सभी प्राणियों के प्रेम से युद्ध किया।',
      takeaway: 'आज, सही के लिए खड़े हों। करुणा को अपनी ताकत का मार्गदर्शक बनाएं।',
    },
    {
      story: 'दुर्गा सिंह की सवारी करती हैं, यह दिखाती हुई कि दूसरों की रक्षा करने से पहले हमें अपनी आंतरिक प्रकृति पर महारत हासिल करनी होगी।',
      takeaway: 'आज, अपनी भावनाओं पर नियंत्रण पाएं। मजबूत और संयमी दोनों बनें।',
    },
  ],
  krishna: [
    {
      story: 'कृष्ण ने अर्जुन को सिखाया कि आनंदित हृदय से किया गया कर्तव्य मुक्ति लाता है। प्रेम से किया गया कार्य खेल बन जाता है।',
      takeaway: 'आज, अपनी जिम्मेदारियों में आनंद लाएं। जो करते हैं उसमें प्रसन्नता खोजें।',
    },
    {
      story: 'कृष्ण ने तूफान में नृत्य किया, यह दिखाते हुए कि सच्चा ज्ञान यह जानना है कि कब गंभीर होना है और कब जीवन का उत्सव मनाना है।',
      takeaway: 'आज, जश्न मनाने का कारण खोजें। काम और खुशी में संतुलन बनाएं।',
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
        story: 'याद रखें कि हर चुनौती मजबूत और बुद्धिमान बनने का अवसर है।',
        takeaway: 'आज, चुनौतियों को अपने विकास के उपहार के रूप में अपनाएं।',
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
          
          <Text style={styles.title}>{deity.name} से आज का ज्ञान</Text>
          <Text style={styles.titleHindi}>({deity.nameHindi})</Text>

          <View style={styles.storyCard}>
            <Text style={styles.storyLabel}>कथा</Text>
            <Text style={styles.storyText}>{wisdom?.story}</Text>
          </View>
          
          <View style={styles.takeawayCard}>
            <Ionicons name="bulb" size={24} color="#FF6B35" style={styles.takeawayIcon} />
            <View style={styles.takeawayContent}>
              <Text style={styles.takeawayLabel}>आज का संदेश</Text>
              <Text style={styles.takeawayText}>{wisdom?.takeaway}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>जारी रखें</Text>
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
