'use client';

import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  autoStart?: boolean;
  showProgress?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  autoStart = true,
  showProgress = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const progress = ((duration - timeLeft) / duration) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-6xl font-bold text-primary tabular-nums">
        {formatTime(timeLeft)}
      </div>

      {showProgress && (
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {!isRunning && timeLeft > 0 && (
          <button
            onClick={() => setIsRunning(true)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Start
          </button>
        )}
        {isRunning && (
          <button
            onClick={() => setIsRunning(false)}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
          >
            Pause
          </button>
        )}
        {timeLeft < duration && (
          <button
            onClick={() => {
              setTimeLeft(duration);
              setIsRunning(false);
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
