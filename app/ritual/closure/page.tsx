'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { getTodaysDeity } from '@/lib/utils/deityRotation';
import { playBellSound, stopAllAudio } from '@/lib/utils/audioManager';

export default function ClosurePage() {
  const router = useRouter();
  const { user, preferences, setStreak } = useUserStore();
  const [isCompleting, setIsCompleting] = useState(false);
  const [milestone, setMilestone] = useState(false);

  useEffect(() => {
    playBellSound();
    return () => stopAllAudio();
  }, []);

  const handleComplete = async () => {
    if (!user || !preferences) return;

    setIsCompleting(true);

    try {
      const allDeities = [preferences.primary_deity, ...preferences.secondary_deities];
      const todayDeity = getTodaysDeity(allDeities);
      const today = new Date().toISOString().split('T')[0];

      const response = await fetch('/api/rituals/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          date: today,
          completed: true,
          steps_completed: 8,
          deity_used: todayDeity,
          soundscape_on: preferences.soundscape_default_on,
          duration_sec: 240,
        }),
      });

      const data = await response.json();

      if (data.milestone) {
        setMilestone(true);
      }

      // Update streak in store
      const streakResponse = await fetch(`/api/streaks/${user.id}`);
      const streakData = await streakResponse.json();
      setStreak(streakData);

      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (error) {
      console.error('Error completing ritual:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Container maxWidth="md" className="min-h-screen flex flex-col justify-center py-8">
      <div className="text-center">
        <div className="text-9xl mb-8 animate-pulse">🪔</div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Ritual Complete
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          May the light guide your path
        </p>

        {milestone && (
          <div className="bg-divine bg-opacity-30 p-6 rounded-lg mb-6">
            <p className="text-2xl font-bold text-primary">🎉 Milestone Reached!</p>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleComplete}
          isLoading={isCompleting}
        >
          {isCompleting ? 'Completing...' : 'Finish Ritual'}
        </Button>
      </div>
    </Container>
  );
}
