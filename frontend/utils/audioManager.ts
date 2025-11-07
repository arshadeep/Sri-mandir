import { Audio } from 'expo-av';

let backgroundSound: Audio.Sound | null = null;
let bellSound: Audio.Sound | null = null;

export const playBackgroundSound = async (soundscapeOn: boolean) => {
  if (!soundscapeOn) return;
  
  try {
    // For now, we'll use a beep/tone as placeholder
    // In production, you would load actual temple bell/om chanting audio files
    
    // Create a simple tone using expo-av
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/placeholder.mp3'), // Placeholder
      { isLooping: true, volume: 0.3 }
    );
    backgroundSound = sound;
    await backgroundSound.playAsync();
  } catch (error) {
    console.log('Error playing background sound:', error);
  }
};

export const stopBackgroundSound = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
    } catch (error) {
      console.log('Error stopping background sound:', error);
    }
  }
};

export const playBellSound = async () => {
  try {
    // Play bell sound effect
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/bell.mp3'), // Placeholder
      { volume: 0.5 }
    );
    bellSound = sound;
    await bellSound.playAsync();
    
    // Unload after playing
    bellSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        bellSound?.unloadAsync();
      }
    });
  } catch (error) {
    console.log('Error playing bell sound:', error);
  }
};

export const playOmChant = async () => {
  try {
    // Simple implementation - in web it will use HTML5 Audio API
    // We'll generate a simple tone for now as placeholder
    console.log('Om chant would play here');
    
    // For web, you can use Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 136.1; // Om frequency (C#)
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    }
  } catch (error) {
    console.log('Error playing Om chant:', error);
  }
};

export const playTempleBells = async () => {
  try {
    console.log('Temple bells would play here');
    
    // For web, generate bell-like tones
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Play multiple bell tones
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 1.5);
        }, index * 300);
      });
    }
  } catch (error) {
    console.log('Error playing temple bells:', error);
  }
};
