import { IconName } from '../const/fa-icons';

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
        label: string;
      }[];
    };
