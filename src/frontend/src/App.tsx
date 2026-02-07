import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Square, Coffee } from 'lucide-react';
import { StatusIndicator } from './components/StatusIndicator';
import { DurationControl } from './components/DurationControl';
import { SettingsPanel } from './components/SettingsPanel';
import { UnsupportedNotice } from './components/UnsupportedNotice';
import { useWakeLock } from './hooks/useWakeLock';
import { useCountdownTimer } from './hooks/useCountdownTimer';
import { useKeepAwakeSettings } from './hooks/useKeepAwakeSettings';
import { usePageLifecycle } from './hooks/usePageLifecycle';
import { useMouseJiggle } from './hooks/useMouseJiggle';

type AppState = 'stopped' | 'running' | 'expired' | 'unsupported';

function App() {
  const { settings, updateSettings } = useKeepAwakeSettings();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(settings.defaultDuration);
  const [appState, setAppState] = useState<AppState>('stopped');
  
  const {
    isSupported,
    isActive,
    error: wakeLockError,
    request: requestWakeLock,
    release: releaseWakeLock,
  } = useWakeLock();

  const {
    remainingSeconds,
    isRunning: timerRunning,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useCountdownTimer({
    onExpire: () => {
      setAppState('expired');
      releaseWakeLock();
    },
  });

  const { isVisible } = usePageLifecycle({
    onBeforeUnload: () => {
      if (isActive) {
        releaseWakeLock();
      }
    },
  });

  // Wire mouse jiggle behavior
  useMouseJiggle({
    enabled: settings.mouseJiggleEnabled,
    isRunning: appState === 'running',
    onlyWhileVisible: settings.onlyWhileVisible,
    isVisible,
  });

  // Handle visibility changes with "only while visible" setting
  useEffect(() => {
    if (!settings.onlyWhileVisible) return;
    
    if (!isVisible && appState === 'running') {
      releaseWakeLock();
    } else if (isVisible && appState === 'running') {
      requestWakeLock();
    }
  }, [isVisible, settings.onlyWhileVisible, appState, requestWakeLock, releaseWakeLock]);

  // Auto-start on mount if enabled
  useEffect(() => {
    if (settings.autoStart && isSupported && appState === 'stopped') {
      handleStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update app state based on support
  useEffect(() => {
    if (!isSupported && appState === 'stopped') {
      setAppState('unsupported');
    }
  }, [isSupported, appState]);

  const handleStart = async () => {
    const success = await requestWakeLock();
    if (success) {
      setAppState('running');
      if (selectedDuration !== null) {
        startTimer(selectedDuration * 60); // Convert minutes to seconds
      }
    }
  };

  const handleStop = () => {
    releaseWakeLock();
    stopTimer();
    resetTimer();
    setAppState('stopped');
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/keep-awake-logo.dim_512x512.png" 
                alt="Keep Awake Logo" 
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Keep Awake</h1>
                <p className="text-sm text-muted-foreground">Prevent your screen from sleeping</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="h-5 w-5 text-chart-1" />
                      Status
                    </CardTitle>
                    <CardDescription>Current keep-awake state</CardDescription>
                  </div>
                  <StatusIndicator state={appState} error={wakeLockError} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {appState === 'unsupported' ? (
                  <UnsupportedNotice />
                ) : (
                  <>
                    {/* Timer Display */}
                    {appState === 'running' && (
                      <div className="text-center py-6">
                        <div className="text-5xl font-bold tabular-nums tracking-tight text-foreground">
                          {selectedDuration === null ? (
                            <div className="flex items-center justify-center gap-2">
                              <span>∞</span>
                              <span className="text-2xl text-muted-foreground">Unlimited</span>
                            </div>
                          ) : (
                            formatTime(remainingSeconds)
                          )}
                        </div>
                        {selectedDuration !== null && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Time remaining
                          </p>
                        )}
                      </div>
                    )}

                    {appState === 'expired' && (
                      <div className="text-center py-6">
                        <p className="text-lg font-medium text-muted-foreground">
                          Timer expired
                        </p>
                      </div>
                    )}

                    {/* Duration Control */}
                    {(appState === 'stopped' || appState === 'expired') && (
                      <DurationControl
                        value={selectedDuration}
                        onChange={setSelectedDuration}
                        disabled={false}
                      />
                    )}

                    {/* Control Buttons */}
                    <div className="flex gap-3">
                      {appState === 'running' ? (
                        <Button
                          onClick={handleStop}
                          variant="destructive"
                          size="lg"
                          className="flex-1"
                        >
                          <Square className="mr-2 h-5 w-5" />
                          Stop
                        </Button>
                      ) : (
                        <Button
                          onClick={handleStart}
                          size="lg"
                          className="flex-1"
                          disabled={!isSupported}
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Start
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Settings Panel */}
            {isSupported && (
              <SettingsPanel
                settings={settings}
                onSettingsChange={updateSettings}
                disabled={appState === 'running'}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 mt-16 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © 2026. Built with <Coffee className="inline h-4 w-4 text-chart-1" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
