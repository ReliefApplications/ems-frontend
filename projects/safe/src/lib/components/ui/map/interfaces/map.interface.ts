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

export enum MapEventType{
  FIRST_LOAD,
  MAP_CHANGE,
  MOVE_END,
  ZOOM_END,
  SELECTED_LAYER
}

export interface MapEvent {
  type: MapEventType;
  content: any;
}
