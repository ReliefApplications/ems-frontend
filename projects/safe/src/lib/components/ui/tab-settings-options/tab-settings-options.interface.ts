import { TooltipPosition } from '@angular/material/tooltip';

export interface TabSettingsOptionConfig<T> {
  tab: T;
  icon: string;
  iconSize: number;
  translation: string;
  tooltipPosition: TooltipPosition;
  disabled?: boolean;
}
