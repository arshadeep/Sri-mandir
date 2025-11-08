'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';
import { DEITIES } from '@/lib/utils/constants';

export default function DeityPreferencesPage() {
  const router = useRouter();
  const { user, preferences, setPreferences } = useUserStore();
  const [primaryDeity, setPrimaryDeity] = useState(preferences?.primary_deity || '');
  const [secondaryDeities, setSecondaryDeities] = useState<string[]>(
    preferences?.secondary_deities || []
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSecondaryToggle = (deityId: string) => {
    if (deityId === primaryDeity) return;

    setSecondaryDeities((prev) => {
      if (prev.includes(deityId)) {
        return prev.filter((id) => id !== deityId);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, deityId];
      }
    });
  };

  const handleSave = async () => {
    if (!user || !preferences) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/preferences/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preferences,
          primary_deity: primaryDeity,
          secondary_deities: secondaryDeities,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
        router.push('/settings');
      }
    } catch (error) {
      console.error('Error updating deities:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="md" className="py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Deity Preferences
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Primary Deity</h2>
        <div className="grid grid-cols-2 gap-4">
          {DEITIES.map((deity) => (
            <Card
              key={deity.id}
              variant={primaryDeity === deity.id ? 'elevated' : 'outlined'}
              className={`p-4 text-center ${
                primaryDeity === deity.id ? 'border-2 border-primary' : ''
              }`}
              onClick={() => {
                setPrimaryDeity(deity.id);
                setSecondaryDeities((prev) => prev.filter((id) => id !== deity.id));
              }}
            >
              <div className="text-2xl mb-2">{deity.nameHindi}</div>
              <div className="font-medium text-sm">{deity.name}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Secondary Deities</h2>
        <p className="text-sm text-gray-600 mb-4">
          Selected: {secondaryDeities.length}/3
        </p>
        <div className="grid grid-cols-2 gap-4">
          {DEITIES.filter((d) => d.id !== primaryDeity).map((deity) => (
            <Card
              key={deity.id}
              variant={secondaryDeities.includes(deity.id) ? 'elevated' : 'outlined'}
              className={`p-4 text-center ${
                secondaryDeities.includes(deity.id) ? 'border-2 border-secondary' : ''
              }`}
              onClick={() => handleSecondaryToggle(deity.id)}
            >
              <div className="text-2xl mb-2">{deity.nameHindi}</div>
              <div className="font-medium text-sm">{deity.name}</div>
            </Card>
          ))}
        </div>
      </div>

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
    </Container>
  );
}
