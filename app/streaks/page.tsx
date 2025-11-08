'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { useUserStore } from '@/store/userStore';

export default function StreaksPage() {
  const { user, streak } = useUserStore();
  const [ritualHistory, setRitualHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      const response = await fetch(`/api/rituals/history/${user.id}`);
      const data = await response.json();
      setRitualHistory(data);
      setIsLoading(false);
    };

    fetchHistory();
  }, [user]);

  if (isLoading) {
    return <Loading text="Loading streak calendar..." />;
  }

  const completedDates = new Set(ritualHistory.map((r) => r.date));

  const tileClassName = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split('T')[0];
    return completedDates.has(dateStr) ? 'completed-day' : '';
  };

  return (
    <Container maxWidth="md" className="py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Your Streak</h1>

      <Card variant="elevated" className="p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {streak?.current_streak || 0}
            </div>
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-2xl mt-2">🔥</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-secondary mb-2">
              {streak?.longest_streak || 0}
            </div>
            <div className="text-sm text-gray-600">Longest Streak</div>
            <div className="text-2xl mt-2">🏆</div>
          </div>
        </div>
      </Card>

      <Card variant="outlined" className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Ritual Calendar
        </h2>
        <div className="calendar-container">
          <Calendar
            tileClassName={tileClassName}
            className="w-full rounded-lg"
          />
        </div>
      </Card>

      <style jsx global>{`
        .completed-day {
          background-color: #ff6b35 !important;
          color: white !important;
          border-radius: 50%;
        }
        .react-calendar {
          border: none !important;
          font-family: inherit;
        }
        .react-calendar__tile--active {
          background-color: #d4af37 !important;
        }
      `}</style>
    </Container>
  );
}
