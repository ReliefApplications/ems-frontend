export interface MapConstructorSettings {
  title?: string;
  centerLong: number;
  centerLat: number;
  maxBounds?: number[];
  baseMap: string;
  zoomControl?: boolean;
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
  worldCopyJump?: boolean;
}

export interface MapEvent {
  type: string;
  content: any;
}
