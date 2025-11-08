'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TEMPLE_IMAGE } from '@/lib/utils/constants';

export default function WelcomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone_or_email, setPhoneOrEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Store in sessionStorage temporarily
    sessionStorage.setItem('onboarding_name', name);
    sessionStorage.setItem('onboarding_contact', phone_or_email);

    router.push('/onboarding/deity-selection');
  };

  return (
    <Container maxWidth="md" className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
        {/* Temple Image */}
        <div className="w-full max-w-sm mb-8 relative h-64">
          <Image
            src={TEMPLE_IMAGE}
            alt="Temple"
            fill
            className="object-cover rounded-2xl shadow-lg"
            priority
          />
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to Sri Mandir
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Begin your journey of daily devotion and spiritual growth
        </p>

        {/* Form */}
        <div className="w-full max-w-sm space-y-4">
          <Input
            label="Your Name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            error={error}
            required
          />

          <Input
            label="Phone or Email (Optional)"
            type="text"
            placeholder="For reminders"
            value={phone_or_email}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            helperText="We'll use this to send you daily reminders"
          />

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-6"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </Container>
  );
}
