// Timer component for game countdown

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/useLanguage';
import { t } from '../i18n';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export function Timer({ duration, onTimeUp, isActive }: TimerProps) {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    setTimeLeft(duration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onTimeUp, isActive]);

  if (!isActive) return null;

  const percentage = (timeLeft / duration) * 100;
  const isLowTime = timeLeft <= 5;

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span className={`timer-text ${isLowTime ? 'timer-warning' : ''}`}>
          {t('game.timeLeft', language)}: {timeLeft}s
        </span>
      </div>
      <div className="timer-bar">
        <div 
          className={`timer-bar-fill ${isLowTime ? 'timer-bar-warning' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
