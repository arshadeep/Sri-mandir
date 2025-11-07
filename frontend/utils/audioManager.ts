let lastSoundTime = 0;
const SOUND_DEBOUNCE = 1000; // Prevent playing sound within 1 second

// Audio instances for better control
let omChantAudio: HTMLAudioElement | null = null;
let bellAudio: HTMLAudioElement | null = null;

export const playOmChant = async () => {
  try {
    const now = Date.now();
    if (now - lastSoundTime < SOUND_DEBOUNCE) {
      return; // Prevent stuttering by debouncing
    }
    lastSoundTime = now;
    
    // Stop any existing chant
    if (omChantAudio) {
      omChantAudio.pause();
      omChantAudio.currentTime = 0;
    }
    
    // Create new audio instance with cache busting
    omChantAudio = new Audio(require('../assets/audio/om_chant.mp3'));
    omChantAudio.volume = 0.6;
    await omChantAudio.play();
    
    console.log('Playing Om chant audio');
  } catch (error) {
    console.log('Error playing Om chant:', error);
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
