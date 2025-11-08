'use client';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Timer } from '@/components/ui/Timer';

interface RitualStepProps {
  title: string;
  description: string;
  duration?: number; // in seconds, if timed
  showTimer?: boolean;
  nextRoute: string;
  children?: React.ReactNode;
}

export const RitualStep: React.FC<RitualStepProps> = ({
  title,
  description,
  duration,
  showTimer = false,
  nextRoute,
  children,
}) => {
  const router = useRouter();

  const handleContinue = () => {
    router.push(nextRoute);
  };

  return (
    <Container maxWidth="md" className="min-h-screen flex flex-col justify-center py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-lg text-gray-600">{description}</p>
      </div>

      {showTimer && duration && (
        <div className="mb-8">
          <Timer duration={duration} onComplete={handleContinue} autoStart />
        </div>
      )}

      {children}

      {!showTimer && (
        <Button
          variant="primary"
          size="lg"
          className="w-full mt-8"
          onClick={handleContinue}
        >
          Continue
        </Button>
      )}
    </Container>
  );
};
