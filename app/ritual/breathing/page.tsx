'use client';

import { RitualStep } from '@/components/shared/RitualStep';

export default function BreathingPage() {
  return (
    <RitualStep
      title="Breathing"
      description="Follow the guided breathing exercise"
      duration={30}
      showTimer
      nextRoute="/ritual/puja"
    >
      <div className="text-center mt-8">
        <p className="text-lg text-gray-700 mb-4">
          Breathe deeply and slowly
        </p>
        <div className="text-6xl mb-4">🌬️</div>
        <p className="text-sm text-gray-600">
          Inhale... Hold... Exhale...
        </p>
      </div>
    </RitualStep>
  );
}
