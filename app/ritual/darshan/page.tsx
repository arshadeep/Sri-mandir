'use client';

import { RitualStep } from '@/components/shared/RitualStep';

export default function DarshanPage() {
  return (
    <RitualStep
      title="Darshan"
      description="Meditate on the divine form"
      duration={60}
      showTimer
      nextRoute="/ritual/wisdom"
    >
      <div className="text-center mt-8">
        <div className="text-8xl mb-6">✨</div>
        <p className="text-lg text-gray-700 max-w-md mx-auto">
          Visualize the deity and receive their divine grace
        </p>
      </div>
    </RitualStep>
  );
}
