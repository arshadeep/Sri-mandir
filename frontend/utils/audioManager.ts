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
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1.5);
      }, index * 300);
    });
  } catch (error) {
    console.log('Error playing temple bells:', error);
  }
};

export const playBellSound = async () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const frequencies = [523.25, 659.25]; // C5, E5
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1);
      }, index * 150);
    });
  } catch (error) {
    console.log('Error playing bell sound:', error);
  }
};
