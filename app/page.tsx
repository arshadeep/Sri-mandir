'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, useHasHydrated } from '@/store/userStore';
import { Loading } from '@/components/ui/Loading';

export default function HomePage() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!hasCompletedOnboarding) {
      router.push('/onboarding/welcome');
    } else {
      router.push('/home');
    }
  }, [hasHydrated, hasCompletedOnboarding, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading text="Loading Sri Mandir..." />
    </div>
  );
}
