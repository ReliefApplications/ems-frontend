import { MapControls } from '../../../../models/widgets/mapWidget.model';

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

/** Default values for the map controls */
export const DefaultMapControls: MapControls = {
  // timedimension: false,
  download: false,
  legend: true,
  measure: false,
  layer: false,
  search: true,
};
