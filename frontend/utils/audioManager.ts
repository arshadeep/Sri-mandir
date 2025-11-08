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
    
    // Fade in to mid volume
    let vol = 0;
    const fadeIn = setInterval(() => {
      if (vol < 0.4) {
        vol += 0.04;
        if (omChantAudio) omChantAudio.volume = Math.min(vol, 0.4);
      } else {
        clearInterval(fadeIn);
      }
    }, 50);
    
    console.log('Playing Om chant audio at mid volume');
  } catch (error) {
    console.log('Error playing Om chant:', error);
  }
};

export const stopOmChant = () => {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
  
  if (omChantAudio) {
    let vol = omChantAudio.volume;
    const quickFade = setInterval(() => {
      vol -= 0.2;
      if (vol <= 0 || !omChantAudio) {
        clearInterval(quickFade);
        if (omChantAudio) {
          omChantAudio.pause();
          omChantAudio.currentTime = 0;
          omChantAudio = null;
        }
      } else {
        omChantAudio.volume = vol;
      }
    }, 50);
    console.log('Stopping Om chant with quick fade');
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
    bellAudio.volume = 0;
    await bellAudio.play();
    
    // Fade in bell
    let vol = 0;
    const fadeIn = setInterval(() => {
      if (vol < 0.5) {
        vol += 0.05;
        if (bellAudio) bellAudio.volume = Math.min(vol, 0.5);
      } else {
        clearInterval(fadeIn);
      }
    }, 50);
    
    console.log('Playing bell sound audio');
  } catch (error) {
    console.log('Error playing bell sound:', error);
  }
};
