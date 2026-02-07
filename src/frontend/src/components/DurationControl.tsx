import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Infinity } from 'lucide-react';

interface DurationControlProps {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}

const PRESET_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '60 min', value: 60 },
  { label: 'Unlimited', value: null, icon: Infinity },
];

export function DurationControl({ value, onChange, disabled }: DurationControlProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Duration</Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRESET_DURATIONS.map((preset) => {
          const isSelected = value === preset.value;
          const Icon = preset.icon;
          
          return (
            <Button
              key={preset.label}
              variant={isSelected ? 'default' : 'outline'}
              size="lg"
              onClick={() => onChange(preset.value)}
              disabled={disabled}
              className="h-auto py-3"
            >
              {Icon ? (
                <Icon className="mr-2 h-4 w-4" />
              ) : null}
              {preset.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
