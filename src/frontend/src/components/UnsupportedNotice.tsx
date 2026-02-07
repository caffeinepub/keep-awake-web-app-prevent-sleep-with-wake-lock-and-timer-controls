import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function UnsupportedNotice() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Wake Lock Not Supported</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          Your browser doesn't support the Screen Wake Lock API, which is required to prevent
          your screen from sleeping.
        </p>
        <p className="text-sm">
          <strong>Note:</strong> Web browsers cannot move your mouse cursor or simulate user
          activity at the operating system level due to security restrictions. This app uses
          the Wake Lock API to keep your screen awake when supported.
        </p>
        <p className="text-sm">
          Try using a modern browser like Chrome, Edge, or Safari on a supported device.
        </p>
      </AlertDescription>
    </Alert>
  );
}
