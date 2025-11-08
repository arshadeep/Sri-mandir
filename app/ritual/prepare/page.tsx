'use client';

import { useState } from 'react';
import { RitualStep } from '@/components/shared/RitualStep';
import { useUserStore } from '@/store/userStore';
import { playOmChant, stopOmChant } from '@/lib/utils/audioManager';

export default function PreparePage() {
  const { preferences } = useUserStore();
  const [soundscapeOn, setSoundscapeOn] = useState(
    preferences?.soundscape_default_on ?? true
  );

  const handleToggleSoundscape = () => {
    if (soundscapeOn) {
      stopOmChant();
    } else {
      playOmChant();
    }
    setSoundscapeOn(!soundscapeOn);
  };

  return (
    <RitualStep
      title="Prepare"
      description="Find a quiet space and prepare yourself for the ritual"
      nextRoute="/ritual/breathing"
    >
      <div className="mt-8 flex flex-col items-center gap-6">
        <p className="text-center text-gray-700 max-w-md">
          Sit comfortably and take a moment to center yourself. When you're ready, we'll begin with breathing exercises.
        </p>

        <div className="flex items-center gap-4 p-4 bg-peace rounded-lg">
          <span className="font-medium">Soundscape</span>
          <button
            onClick={handleToggleSoundscape}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              soundscapeOn ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                soundscapeOn ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </RitualStep>
  );
}
