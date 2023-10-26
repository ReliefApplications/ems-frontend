import * as L from 'leaflet';

/**
 * Map settings for leaflet.
 */
export interface MapConstructorSettings {
  title?: string;
  initialState: {
    viewpoint: {
      center: {
        latitude: number;
        longitude: number;
      };
      zoom: number;
    };
  };
  // maxBounds array of two points [[southWest], [northEast]]
  // e.g. [[-90, -180], [90, 180]]
  maxBounds?: number[][];
  basemap?: string;
  zoomControl?: boolean;
  minZoom?: number;
  maxZoom?: number;
  worldCopyJump?: boolean;
  layers?: string[];
  pm?: any;
  pmIgnore?: boolean;
  controls: MapControls;
  arcGisWebMap?: string;
}

/** Available leaflet event types. */
export enum MapEventType {
  FIRST_LOAD,
  MAP_CHANGE,
  MOVE_END,
  ZOOM_END,
  SELECTED_LAYER,
}

/** Map event interface */
export interface MapEvent {
  type: MapEventType;
  content: any;
}

/** Map controls interface */
export interface MapControls {
  // timedimension: boolean;
  download: boolean;
  legend: boolean;
  measure: boolean;
  layer: boolean;
  search: boolean;
  lastUpdate: L.ControlPosition | undefined | null;
}

/** Default values for the map controls */
export const DefaultMapControls: MapControls = {
  // timedimension: false,
  download: false,
  legend: true,
  measure: false,
  layer: false,
  search: true,
  lastUpdate: null,
};
