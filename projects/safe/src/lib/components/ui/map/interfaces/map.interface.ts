/**
 * Map settings for leaflet.
 */
export interface MapConstructorSettings {
  title?: string;
  centerLong: number;
  centerLat: number;
  maxBounds?: number[];
  basemap?: string;
  zoomControl?: boolean;
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
  worldCopyJump?: boolean;
  layers?: any[];
  pm?: any;
  pmIgnore?: boolean;
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
