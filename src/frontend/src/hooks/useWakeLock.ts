import { useState, useCallback, useRef, useEffect } from 'react';

interface UseWakeLockReturn {
  isSupported: boolean;
  isActive: boolean;
  error: string | null;
  request: () => Promise<boolean>;
  release: () => void;
}

export function useWakeLock(): UseWakeLockReturn {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const isSupported = 'wakeLock' in navigator;

  const release = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current
        .release()
        .then(() => {
          wakeLockRef.current = null;
          setIsActive(false);
          setError(null);
        })
        .catch((err) => {
          console.error('Failed to release wake lock:', err);
          setError('Failed to release wake lock');
        });
    }
  }, []);

  const request = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Wake Lock API is not supported in this browser');
      return false;
    }

    try {
      // Release existing lock if any
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
      }

      const wakeLock = await navigator.wakeLock.request('screen');
      wakeLockRef.current = wakeLock;
      setIsActive(true);
      setError(null);

      // Handle wake lock release (e.g., when tab becomes hidden)
      wakeLock.addEventListener('release', () => {
        setIsActive(false);
      });

      return true;
    } catch (err) {
      console.error('Failed to request wake lock:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to acquire wake lock';
      setError(errorMessage);
      setIsActive(false);
      return false;
    }
  }, [isSupported]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      release();
    };
  }, [release]);

  return {
    isSupported,
    isActive,
    error,
    request,
    release,
  };
}
