'use client';

import { RitualStep } from '@/components/shared/RitualStep';

export default function WisdomPage() {
  return (
    <RitualStep
      title="Wisdom"
      description="Reflect on spiritual teachings"
      nextRoute="/ritual/blessing"
    >
      <div className="text-center mt-8">
        <div className="text-8xl mb-6">📿</div>
        <div className="bg-wisdom p-6 rounded-lg max-w-md mx-auto">
          <p className="text-lg italic text-gray-800">
            "The mind is everything. What you think, you become."
          </p>
          <p className="text-sm text-gray-600 mt-2">- Ancient Wisdom</p>
        </div>
      </div>
    </RitualStep>
  );
}
