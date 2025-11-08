'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export const Navigation = () => {
  const pathname = usePathname();
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);

  // Hide navigation on onboarding pages
  if (pathname?.startsWith('/onboarding') || !hasCompletedOnboarding) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/ritual/prepare', label: 'Ritual', icon: '🙏' },
    { href: '/streaks', label: 'Streaks', icon: '🔥' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-primary border-opacity-20 shadow-lg z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive(item.href)
                ? 'text-primary border-t-2 border-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
