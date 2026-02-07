import { useLocalStorageState } from './useLocalStorageState';

export interface KeepAwakeSettings {
  autoStart: boolean;
  defaultDuration: number | null;
  onlyWhileVisible: boolean;
  mouseJiggleEnabled: boolean;
}

const DEFAULT_SETTINGS: KeepAwakeSettings = {
  autoStart: false,
  defaultDuration: 30,
  onlyWhileVisible: false,
  mouseJiggleEnabled: false,
};

const SETTINGS_KEY = 'keep-awake-settings';

export function useKeepAwakeSettings() {
  const [settings, setSettings] = useLocalStorageState<KeepAwakeSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS
  );

  // Ensure backward compatibility: merge stored settings with defaults
  const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };

  const updateSettings = (updates: Partial<KeepAwakeSettings>) => {
    setSettings((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...updates }));
  };

  return {
    settings: mergedSettings,
    updateSettings,
  };
}
