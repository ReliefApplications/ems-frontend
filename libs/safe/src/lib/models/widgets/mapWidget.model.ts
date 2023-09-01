import { SafeMapSettingsComponent } from '../../components/widgets/map-settings/map-settings.component';
import { Widget, WidgetSettings } from './widget.model';

/** Map widget */
export class MapWidget extends Widget {
  public override settings!: MapWidgetSettings;

  /** Map widget */
  constructor() {
    super(
      'map',
      'Map',
      '/assets/map.svg',
      '#D58CA6',
      {
        title: 'Map widget',
      },
      4,
      4,
      1,
      'map',
      SafeMapSettingsComponent
    );
  }
}

/** Map widget settings */
export interface MapWidgetSettings extends WidgetSettings {
  initialState?: MapInitialState;
  maxBounds?: number[][];
  basemap?: string;
  zoomControl?: boolean;
  minZoom?: number;
  maxZoom?: number;
  worldCopyJump?: boolean;
  layers?: string[];
  pm?: any;
  pmIgnore?: boolean;
  controls?: MapControls;
  arcGisWebMap?: string;
}

/** Initial state when loading the map */
interface MapInitialState {
  viewpoint: {
    zoom: number;
    center: {
      longitude: number;
      latitude: number;
    };
  };
}

/** Map controls interface */
export interface MapControls {
  // timedimension: boolean;
  download: boolean;
  legend: boolean;
  measure: boolean;
  layer: boolean;
  search: boolean;
}
