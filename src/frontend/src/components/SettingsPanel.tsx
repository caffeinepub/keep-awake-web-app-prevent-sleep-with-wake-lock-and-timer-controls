import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';
import type { KeepAwakeSettings } from '../hooks/useKeepAwakeSettings';

interface SettingsPanelProps {
  settings: KeepAwakeSettings;
  onSettingsChange: (settings: Partial<KeepAwakeSettings>) => void;
  disabled?: boolean;
}

export function SettingsPanel({ settings, onSettingsChange, disabled }: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Settings
        </CardTitle>
        <CardDescription>Configure keep-awake behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-start */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="auto-start" className="text-base">
              Auto-start
            </Label>
            <p className="text-sm text-muted-foreground">
              Start automatically when page loads
            </p>
          </div>
          <Switch
            id="auto-start"
            checked={settings.autoStart}
            onCheckedChange={(checked) => onSettingsChange({ autoStart: checked })}
            disabled={disabled}
          />
        </div>

        {/* Only while visible */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="only-visible" className="text-base">
              Only while visible
            </Label>
            <p className="text-sm text-muted-foreground">
              Release wake lock when tab is hidden
            </p>
          </div>
          <Switch
            id="only-visible"
            checked={settings.onlyWhileVisible}
            onCheckedChange={(checked) => onSettingsChange({ onlyWhileVisible: checked })}
            disabled={disabled}
          />
        </div>

        {/* Default duration */}
        <div className="space-y-2">
          <Label htmlFor="default-duration" className="text-base">
            Default duration
          </Label>
          <Select
            value={settings.defaultDuration?.toString() ?? 'null'}
            onValueChange={(value) => {
              const duration = value === 'null' ? null : parseInt(value, 10);
              onSettingsChange({ defaultDuration: duration });
            }}
            disabled={disabled}
          >
            <SelectTrigger id="default-duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="null">Unlimited</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Mouse jiggle */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="mouse-jiggle" className="text-base">
              Mouse movement
            </Label>
            <p className="text-sm text-muted-foreground">
              Periodically simulate mouse activity in the browser. Note: This does not move your physical cursor and may not prevent sleep on all systems.
            </p>
          </div>
          <Switch
            id="mouse-jiggle"
            checked={settings.mouseJiggleEnabled}
            onCheckedChange={(checked) => onSettingsChange({ mouseJiggleEnabled: checked })}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
