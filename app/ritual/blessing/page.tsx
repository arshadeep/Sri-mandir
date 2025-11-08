'use client';

import { useEffect, useState } from 'react';
import { RitualStep } from '@/components/shared/RitualStep';
import { Loading } from '@/components/ui/Loading';
import { useUserStore } from '@/store/userStore';
import { getTodaysDeity } from '@/lib/utils/deityRotation';

export default function BlessingPage() {
  const { preferences } = useUserStore();
  const [blessing, setBlessing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlessing = async () => {
      if (!preferences) return;

      const allDeities = [preferences.primary_deity, ...preferences.secondary_deities];
      const todayDeity = getTodaysDeity(allDeities);

      const response = await fetch(`/api/blessings/random?deity=${todayDeity}`);
      const data = await response.json();
      setBlessing(data);
      setIsLoading(false);
    };

    fetchBlessing();
  }, [preferences]);

  if (isLoading) {
    return <Loading text="Receiving blessing..." />;
  }

  return (
    <RitualStep
      title="Blessing"
      description="Receive today's divine blessing"
      nextRoute="/ritual/seva"
    >
      <div className="text-center mt-8">
        <div className="text-8xl mb-6">🕉️</div>
        <div className="bg-divine bg-opacity-20 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-xl text-gray-800 leading-relaxed">
            {blessing?.text_en || 'May divine grace guide you today'}
          </p>
        </div>
      </div>
    </RitualStep>
  );
}
