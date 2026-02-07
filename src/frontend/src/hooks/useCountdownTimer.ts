import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountdownTimerOptions {
  onExpire?: () => void;
}

interface UseCountdownTimerReturn {
  remainingSeconds: number;
  isRunning: boolean;
  start: (durationSeconds: number) => void;
  stop: () => void;
  reset: () => void;
}

export function useCountdownTimer(options: UseCountdownTimerOptions = {}): UseCountdownTimerReturn {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const { onExpire } = options;

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRemainingSeconds(0);
  }, []);

  const start = useCallback((durationSeconds: number) => {
    stop();
    setRemainingSeconds(durationSeconds);
    setIsRunning(true);
  }, [stop]);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
      };
    } else if (isRunning && remainingSeconds === 0) {
      stop();
      onExpire?.();
    }
  }, [isRunning, remainingSeconds, stop, onExpire]);

  return {
    remainingSeconds,
    isRunning,
    start,
    stop,
    reset,
  };
}
