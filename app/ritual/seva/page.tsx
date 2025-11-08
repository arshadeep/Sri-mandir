'use client';

import { RitualStep } from '@/components/shared/RitualStep';

export default function SevaPage() {
  return (
    <RitualStep
      title="Seva"
      description="Commit to an act of service"
      nextRoute="/ritual/closure"
    >
      <div className="text-center mt-8">
        <div className="text-8xl mb-6">🤝</div>
        <p className="text-lg text-gray-700 max-w-md mx-auto mb-6">
          Service to others is service to the divine
        </p>
        <div className="bg-peace p-4 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-gray-700">
            Today, I commit to helping someone in need
          </p>
        </div>
      </div>
    </RitualStep>
  );
}
