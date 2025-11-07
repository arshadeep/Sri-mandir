let lastSoundTime = 0;
const SOUND_DEBOUNCE = 1000;

// Audio instances for better control
let omChantAudio: HTMLAudioElement | null = null;
let bellAudio: HTMLAudioElement | null = null;
let fadeInterval: NodeJS.Timeout | null = null;

export const playOmChant = async () => {
  try {
    const now = Date.now();
    if (now - lastSoundTime < SOUND_DEBOUNCE) {
      return;
    }
    lastSoundTime = now;
    
    // Stop any existing chant
    if (omChantAudio) {
      omChantAudio.pause();
      omChantAudio.currentTime = 0;
    }
    
    // Create new audio instance
    omChantAudio = new Audio(require('../assets/audio/om_chant.mp3'));
    omChantAudio.volume = 0;
    await omChantAudio.play();
    
    // Fade in
    let vol = 0;
    const fadeIn = setInterval(() => {
      if (vol < 0.6) {
        vol += 0.05;
        if (omChantAudio) omChantAudio.volume = Math.min(vol, 0.6);
      } else {
        clearInterval(fadeIn);
      }
    }, 50);
    
    console.log('Playing Om chant audio');
  } catch (error) {
    console.log('Error playing Om chant:', error);
  }
};

export const stopOmChant = () => {
  if (omChantAudio) {
    // Fade out
    let vol = omChantAudio.volume;
    if (fadeInterval) clearInterval(fadeInterval);
    
    fadeInterval = setInterval(() => {
      if (vol > 0.05) {
        vol -= 0.1;
        if (omChantAudio) omChantAudio.volume = Math.max(vol, 0);
      } else {
        if (omChantAudio) {
          omChantAudio.pause();
          omChantAudio.currentTime = 0;
        }
        omChantAudio = null;
        if (fadeInterval) clearInterval(fadeInterval);
      }
    }, 50);
    
    console.log('Stopping Om chant audio with fade');
  }
};

export const playTempleBells = async () => {
  try {
    // Stop any existing bell sound
    if (bellAudio) {
      bellAudio.pause();
      bellAudio.currentTime = 0;
    }
    
    // Create new audio instance
    bellAudio = new Audio(require('../assets/audio/bell.mp3'));
    bellAudio.volume = 0.5;
    await bellAudio.play();
    
    console.log('Playing temple bells audio');
  } catch (error) {
    console.log('Error playing temple bells:', error);
  }
};

export const playBellSound = async () => {
  try {
    // Stop any existing bell sound
    if (bellAudio) {
      bellAudio.pause();
      bellAudio.currentTime = 0;
    }
    
    // Create new audio instance
    bellAudio = new Audio(require('../assets/audio/bell.mp3'));
    bellAudio.volume = 0.5;
    await bellAudio.play();
    
    console.log('Playing bell sound audio');
  } catch (error) {
    console.log('Error playing bell sound:', error);
  }
};
