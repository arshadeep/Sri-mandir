'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { useUserStore } from '@/store/userStore';
import { getTodaysDeity, getDeityDisplay } from '@/lib/utils/deityRotation';
import { DEITY_IMAGES } from '@/lib/utils/constants';

export default function HomePage() {
  const router = useRouter();
  const { user, preferences, streak } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [todayDeity, setTodayDeity] = useState('');

  useEffect(() => {
    if (!user || !preferences) {
      router.push('/');
      return;
    }

    // Determine today's deity
    const allDeities = [preferences.primary_deity, ...preferences.secondary_deities];
    const deity = getTodaysDeity(allDeities);
    setTodayDeity(deity);
    setIsLoading(false);
  }, [user, preferences, router]);

  if (isLoading || !user || !preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const deityInfo = getDeityDisplay(todayDeity);
  const deityImages = DEITY_IMAGES[todayDeity] || [];
  const deityImage = deityImages[0];

  const hasCompletedToday = streak?.last_completed_date === new Date().toISOString().split('T')[0];

  return (
    <Container maxWidth="md" className="py-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Namaste, {user.name}
        </h1>
        <p className="text-gray-600">Welcome to your spiritual journey</p>
      </div>

      {/* Today's Deity Card */}
      <Card variant="elevated" className="mb-6 overflow-hidden">
        <div className="relative h-64">
          {deityImage && (
            <Image
              src={deityImage}
              alt={deityInfo.name}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h2 className="text-3xl font-bold text-white mb-1">
              {deityInfo.name}
            </h2>
            <p className="text-4xl text-white">{deityInfo.nameHindi}</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Today's devotion is dedicated to {deityInfo.name}
          </p>
          {!hasCompletedToday ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/ritual/prepare')}
            >
              Begin Today's Ritual
            </Button>
          ) : (
            <div className="bg-peace p-4 rounded-lg text-center">
              <p className="text-primary font-medium">✓ Ritual Completed Today</p>
            </div>
          )}
        </div>
      </Card>

      {/* Streak Information */}
      <Card variant="outlined" className="mb-6 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Your Streak
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-1">
              {streak?.current_streak || 0}
            </div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-1">
              {streak?.longest_streak || 0}
            </div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          variant="outlined"
          className="p-6 text-center"
          onClick={() => router.push('/streaks')}
        >
          <div className="text-3xl mb-2">🔥</div>
          <div className="font-medium text-foreground">View Calendar</div>
        </Card>
        <Card
          variant="outlined"
          className="p-6 text-center"
          onClick={() => router.push('/settings')}
        >
          <div className="text-3xl mb-2">⚙️</div>
          <div className="font-medium text-foreground">Settings</div>
        </Card>
      </div>
    </Container>
  );
}
