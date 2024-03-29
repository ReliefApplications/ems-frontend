import { IconName } from '@fortawesome/fontawesome-svg-core';

/** Interface for a layer legends */
export type LegendDefinition =
  | {
      type: 'feature';
      items: {
        label: string;
        color: string;
        icon?: IconName | 'leaflet_default';
      }[];
    }
  | {
      type: 'cluster';
      color: string;
      icon?: IconName | 'leaflet_default';
      min: number;
      max: number;
    }
  | {
      type: 'heatmap';
      gradient: {
        value: number;
        color: string;
      }[];
    };
