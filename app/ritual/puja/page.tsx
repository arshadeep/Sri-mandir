'use client';

import { RitualStep } from '@/components/shared/RitualStep';

export default function PujaPage() {
  return (
    <RitualStep
      title="Puja"
      description="Offer your prayers and devotion"
      nextRoute="/ritual/darshan"
    >
      <div className="text-center mt-8">
        <div className="text-8xl mb-6">🙏</div>
        <p className="text-lg text-gray-700 max-w-md mx-auto">
          Offer flowers, incense, or simply your heartfelt prayers to the divine
        </p>
      </div>
    </RitualStep>
  );
}
