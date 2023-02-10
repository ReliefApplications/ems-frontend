/** Default options for the marker */
/** Declares an interface that will be used in the cluster markers layers */
export interface IMarkersLayerValue {
  [name: string]: any;
}

/** Declares an interface that will be used in the overlays */
export interface LayerTree {
  label?: string;
  children?: LayerTree[];
  layer?: any;
  type?: string;
  options?: any;
}
