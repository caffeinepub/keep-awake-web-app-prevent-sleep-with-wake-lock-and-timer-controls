import { useEffect, useState } from 'react';

interface UsePageLifecycleOptions {
  onBeforeUnload?: () => void;
}

interface UsePageLifecycleReturn {
  isVisible: boolean;
}

export function usePageLifecycle(options: UsePageLifecycleOptions = {}): UsePageLifecycleReturn {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const { onBeforeUnload } = options;

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const handleBeforeUnload = () => {
      onBeforeUnload?.();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [onBeforeUnload]);

  return { isVisible };
}
