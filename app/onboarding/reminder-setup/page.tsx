'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { REMINDER_TIME_RANGE } from '@/lib/utils/constants';

export default function ReminderSetupPage() {
  const router = useRouter();
  const { setUser, setPreferences, setStreak, setHasCompletedOnboarding, setIsLoading } = useUserStore();

  const [reminderTime, setReminderTime] = useState(REMINDER_TIME_RANGE.default);
  const [soundscapeOn, setSoundscapeOn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      // Get data from sessionStorage
      const name = sessionStorage.getItem('onboarding_name') || '';
      const phone_or_email = sessionStorage.getItem('onboarding_contact') || '';
      const primary_deity = sessionStorage.getItem('onboarding_primary_deity') || '';
      const secondary_deities = JSON.parse(
        sessionStorage.getItem('onboarding_secondary_deities') || '[]'
      );

      if (!name || !primary_deity) {
        setError('Missing required information. Please start over.');
        return;
      }

      // 1. Create user
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone_or_email: phone_or_email || null }),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to create user');
      }

      const userData = await userResponse.json();
      setUser(userData);

      // 2. Create preferences
      const preferencesData = {
        user_id: userData.id,
        primary_deity,
        secondary_deities,
        reminder_time: reminderTime,
        soundscape_default_on: soundscapeOn,
        soundscape_type: 'temple_bells',
        weekday_mapping_enabled: true,
      };

      const prefsResponse = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferencesData),
      });

      if (!prefsResponse.ok) {
        throw new Error('Failed to create preferences');
      }

      const prefsData = await prefsResponse.json();
      setPreferences(prefsData);

      // 3. Initialize streak
      const streakResponse = await fetch('/api/streaks/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userData.id }),
      });

      if (!streakResponse.ok) {
        throw new Error('Failed to initialize streak');
      }

      const streakData = await streakResponse.json();
      setStreak(streakData);

      // 4. Mark onboarding complete
      setHasCompletedOnboarding(true);

      // 5. Clear sessionStorage
      sessionStorage.removeItem('onboarding_name');
      sessionStorage.removeItem('onboarding_contact');
      sessionStorage.removeItem('onboarding_primary_deity');
      sessionStorage.removeItem('onboarding_secondary_deities');

      // 6. Navigate to home
      router.push('/home');
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" className="min-h-screen flex flex-col justify-center py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Set Your Reminder
        </h1>
        <p className="text-gray-600">
          Choose when you'd like to be reminded for your daily ritual
        </p>
      </div>

      <div className="space-y-6">
        {/* Reminder Time */}
        <div>
          <Input
            label="Daily Reminder Time"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            min={REMINDER_TIME_RANGE.min}
            max={REMINDER_TIME_RANGE.max}
            helperText="Recommended: Early morning (5 AM - 9 AM)"
          />
        </div>

        {/* Soundscape Toggle */}
        <div className="flex items-center justify-between p-4 bg-peace rounded-lg">
          <div>
            <h3 className="font-medium text-foreground">Soundscape</h3>
            <p className="text-sm text-gray-600">
              Play ambient temple sounds during ritual
            </p>
          </div>
          <button
            onClick={() => setSoundscapeOn(!soundscapeOn)}
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

        {error && (
          <p className="text-accent text-sm">{error}</p>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-6"
          onClick={handleComplete}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Setting up...' : 'Complete Setup'}
        </Button>
      </div>
    </Container>
  );
}
