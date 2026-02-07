import { useEffect, useRef } from 'react';

interface UseMouseJiggleOptions {
  enabled: boolean;
  isRunning: boolean;
  onlyWhileVisible: boolean;
  isVisible: boolean;
}

const JIGGLE_INTERVAL_MS = 30000; // 30 seconds

export function useMouseJiggle({
  enabled,
  isRunning,
  onlyWhileVisible,
  isVisible,
}: UseMouseJiggleOptions) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Determine if we should be active
    const shouldBeActive = enabled && isRunning && (!onlyWhileVisible || isVisible);

    const dispatchMouseMove = () => {
      // Dispatch a synthetic mousemove event within the document
      const event = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      });
      document.dispatchEvent(event);
    };

    const cleanup = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (shouldBeActive) {
      // Start the periodic mouse jiggle
      intervalRef.current = window.setInterval(dispatchMouseMove, JIGGLE_INTERVAL_MS);
    } else {
      // Stop if not active
      cleanup();
    }

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [enabled, isRunning, onlyWhileVisible, isVisible]);

  // Additional cleanup on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, []);
}
