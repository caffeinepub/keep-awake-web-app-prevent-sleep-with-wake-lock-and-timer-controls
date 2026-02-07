import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

type AppState = 'stopped' | 'running' | 'expired' | 'unsupported';

interface StatusIndicatorProps {
  state: AppState;
  error?: string | null;
}

export function StatusIndicator({ state, error }: StatusIndicatorProps) {
  if (error) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5" />
        Error
      </Badge>
    );
  }

  switch (state) {
    case 'running':
      return (
        <Badge className="gap-1.5 bg-chart-2 hover:bg-chart-2/90">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Running
        </Badge>
      );
    case 'stopped':
      return (
        <Badge variant="secondary" className="gap-1.5">
          <XCircle className="h-3.5 w-3.5" />
          Stopped
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="outline" className="gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Expired
        </Badge>
      );
    case 'unsupported':
      return (
        <Badge variant="destructive" className="gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          Unsupported
        </Badge>
      );
    default:
      return null;
  }
}
