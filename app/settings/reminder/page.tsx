'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { REMINDER_TIME_RANGE } from '@/lib/utils/constants';

export default function ReminderSettingsPage() {
  const router = useRouter();
  const { user, preferences, setPreferences } = useUserStore();
  const [reminderTime, setReminderTime] = useState(
    preferences?.reminder_time || REMINDER_TIME_RANGE.default
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !preferences) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/preferences/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preferences,
          reminder_time: reminderTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
        router.push('/settings');
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="md" className="py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Reminder Settings
      </h1>

      <div className="space-y-6">
        <Input
          label="Daily Reminder Time"
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          min={REMINDER_TIME_RANGE.min}
          max={REMINDER_TIME_RANGE.max}
        />

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save
          </Button>
        </div>
      </div>
    </Container>
  );
}
