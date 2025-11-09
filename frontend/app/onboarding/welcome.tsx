import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TEMPLE_IMAGE = 'https://customer-assets.emergentagent.com/job_srimandir/artifacts/glf2b8ka_Outside_the_Bull_Temple%2C_Bangalore%2C_India_20170916114001.jpg';

export default function Welcome() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleBegin = () => {
    if (!name.trim()) {
      Alert.alert('नाम आवश्यक है', 'कृपया जारी रखने के लिए अपना नाम दर्ज करें।');
      return;
    }
    
    router.push({
      pathname: '/onboarding/deity-selection',
      params: { user_name: name.trim() }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Temple Image */}
            <Image 
              source={{ uri: TEMPLE_IMAGE }}
              style={styles.templeImage}
              resizeMode="cover"
            />
            
            <View style={styles.iconContainer}>
              <Ionicons name="flower" size={60} color="#FF6B35" />
            </View>
            
            <Text style={styles.title}>श्री मंदिर</Text>
            <Text style={styles.subtitle}>आपकी सुबह की शुरुआत शांतिपूर्ण हो</Text>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>अपना नाम दर्ज करें</Text>
              <TextInput
                style={styles.input}
                placeholder="आपका नाम"
                placeholderTextColor="#D4B5A0"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.spacer} />
            
            <TouchableOpacity
              style={styles.button}
              onPress={handleBegin}
            >
              <Text style={styles.buttonText}>अपनी यात्रा शुरू करें</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  templeImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B4423',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFE4D6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#2C1810',
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 24,
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
