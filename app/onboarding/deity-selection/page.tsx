'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DEITIES } from '@/lib/utils/constants';

export default function DeitySelectionPage() {
  const router = useRouter();
  const [primaryDeity, setPrimaryDeity] = useState<string>('');
  const [secondaryDeities, setSecondaryDeities] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handlePrimarySelect = (deityId: string) => {
    setPrimaryDeity(deityId);
    // Remove from secondary if selected there
    setSecondaryDeities((prev) => prev.filter((id) => id !== deityId));
    setError('');
  };

  const handleSecondaryToggle = (deityId: string) => {
    if (deityId === primaryDeity) return; // Can't select primary as secondary

    setSecondaryDeities((prev) => {
      if (prev.includes(deityId)) {
        return prev.filter((id) => id !== deityId);
      } else {
        if (prev.length >= 3) {
          setError('Maximum 3 secondary deities allowed');
          return prev;
        }
        return [...prev, deityId];
      }
    });
  };

  const handleContinue = () => {
    if (!primaryDeity) {
      setError('Please select your primary deity');
      return;
    }

    // Store in sessionStorage temporarily
    sessionStorage.setItem('onboarding_primary_deity', primaryDeity);
    sessionStorage.setItem('onboarding_secondary_deities', JSON.stringify(secondaryDeities));

    router.push('/onboarding/reminder-setup');
  };

  return (
    <Container maxWidth="md" className="min-h-screen py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Choose Your Deities
        </h1>
        <p className="text-gray-600">
          Select your primary deity and up to 3 secondary deities for daily rotation
        </p>
      </div>

      {/* Primary Deity Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Primary Deity (Required)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {DEITIES.map((deity) => (
            <Card
              key={deity.id}
              variant={primaryDeity === deity.id ? 'elevated' : 'outlined'}
              className={`p-4 text-center ${
                primaryDeity === deity.id
                  ? 'border-2 border-primary'
                  : ''
              }`}
              onClick={() => handlePrimarySelect(deity.id)}
            >
              <div className="text-3xl mb-2" style={{ color: deity.color }}>
                {deity.nameHindi}
              </div>
              <div className="font-medium text-foreground">{deity.name}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Secondary Deities Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Secondary Deities (Optional)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Selected: {secondaryDeities.length}/3
        </p>
        <div className="grid grid-cols-2 gap-4">
          {DEITIES.filter((d) => d.id !== primaryDeity).map((deity) => (
            <Card
              key={deity.id}
              variant={secondaryDeities.includes(deity.id) ? 'elevated' : 'outlined'}
              className={`p-4 text-center ${
                secondaryDeities.includes(deity.id)
                  ? 'border-2 border-secondary'
                  : ''
              }`}
              onClick={() => handleSecondaryToggle(deity.id)}
            >
              <div className="text-3xl mb-2" style={{ color: deity.color }}>
                {deity.nameHindi}
              </div>
              <div className="font-medium text-foreground">{deity.name}</div>
            </Card>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-accent text-sm mb-4">{error}</p>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleContinue}
      >
        Continue
      </Button>
    </Container>
  );
}
