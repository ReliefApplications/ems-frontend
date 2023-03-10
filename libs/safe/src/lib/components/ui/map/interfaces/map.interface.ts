/**
 * Map settings for leaflet.
 */
export interface MapConstructorSettings {
  title?: string;
  centerLong: number;
  centerLat: number;
  // maxBounds array of two points [[southWest], [northEast]]
  // e.g. [[-90, -180], [90, 180]]
  maxBounds?: number[][];
  zoomControl?: boolean;
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
  worldCopyJump?: boolean;
  layers?: any[];
  pm?: any;
  pmIgnore?: boolean;
  timeDimension?: boolean;
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
