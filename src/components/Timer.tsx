/**
 * Timer component for game countdown.
 *
 * Displays a countdown timer that resets whenever the `isActive` prop changes.
 * When `isActive` is false, the timer is hidden and reset to the initial duration.
 * When `isActive` becomes true, the timer starts counting down from `duration` seconds.
 * If the timer reaches zero, the `onTimeUp` callback is called (only if still mounted/active).
 * When the time left is at or below 25% of duration, a visual warning is shown.
 *
 * Uses refs to avoid race conditions during cleanup - the `onTimeUp` callback is only
 * invoked if the timer effect is still mounted and active.
 *
 * @param {object} props - Timer props
 * @param {number} props.duration - The countdown duration in seconds.
 * @param {() => void} props.onTimeUp - Callback invoked when the timer reaches zero.
 * @param {boolean} props.isActive - Whether the timer is active and visible.
 */

import { useEffect, useState, useRef } from 'react';
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
  const isActiveRef = useRef(isActive);
  const onTimeUpRef = useRef(onTimeUp);
  const isMountedRef = useRef(false);

  // Keep refs up to date
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    setTimeLeft(duration);
    // Reset mounted flag when timer starts (needed after cleanup has set it to false)
    isMountedRef.current = true;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Check if timer is still mounted before calling onTimeUp
          if (isMountedRef.current && isActiveRef.current) {
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [duration, isActive]);

  if (!isActive) return null;

  const percentage = (timeLeft / duration) * 100;
  // Warning threshold is 25% of duration (but at least the last 3 seconds)
  const warningThreshold = Math.max(3, Math.ceil(duration * 0.25));
  const isLowTime = timeLeft <= warningThreshold;

  const timerTextClass = ['timer-text', isLowTime && 'timer-warning'].filter(Boolean).join(' ');
  const timerBarFillClass = ['timer-bar-fill', isLowTime && 'timer-bar-warning'].filter(Boolean).join(' ');

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span className={timerTextClass}>
          {t('game.timeLeft', language)}: {timeLeft}s
        </span>
      </div>
      <div className="timer-bar">
        <div 
          className={timerBarFillClass}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
