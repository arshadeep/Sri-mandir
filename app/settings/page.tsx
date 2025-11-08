'use client';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';

export default function SettingsPage() {
  const router = useRouter();
  const { user, clearUser } = useUserStore();

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  return (
    <Container maxWidth="md" className="py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Settings</h1>

      <div className="space-y-4">
        <Card
          variant="outlined"
          className="p-4 flex items-center justify-between"
          onClick={() => router.push('/settings/reminder')}
        >
          <div>
            <h3 className="font-medium text-foreground">Reminder Time</h3>
            <p className="text-sm text-gray-600">Update your daily reminder</p>
          </div>
          <div className="text-2xl">🔔</div>
        </Card>

        <Card
          variant="outlined"
          className="p-4 flex items-center justify-between"
          onClick={() => router.push('/settings/deity-preferences')}
        >
          <div>
            <h3 className="font-medium text-foreground">Deity Preferences</h3>
            <p className="text-sm text-gray-600">Change your deity selections</p>
          </div>
          <div className="text-2xl">🕉️</div>
        </Card>

        <Card variant="outlined" className="p-4">
          <div className="mb-4">
            <h3 className="font-medium text-foreground mb-2">Account</h3>
            <p className="text-sm text-gray-600">Logged in as: {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
          >
            Logout
          </button>
        </Card>
      </div>
    </Container>
  );
}
