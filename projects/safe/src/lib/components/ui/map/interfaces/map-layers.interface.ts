/** Default options for the marker */
/** Declares an interface that will be used in the cluster markers layers */
export interface IMarkersLayerValue {
  [name: string]: any;
}

/** Declares an interface that will be used in the base tree */
export interface BaseLayerTree {
  // Properties used for the 'leaflet.control.layers.tree' module
  label: string;
  children?: BaseLayerTree[];
  layer?: any;
  // Custom properties added to use for the layers tree
  options?: any;
}

/** Declares an interface that will be used in the overlay tree */
export interface OverlayLayerTree extends BaseLayerTree {
  // Properties used for the 'leaflet.control.layers.tree' module
  children?: OverlayLayerTree[];
  selectAllCheckbox?: string | boolean;
}

/**
 * Declares an interface that will be used on what action has to perform the layer sent to the map component *
 */
export interface LayerActionOnMap {
  layerData: BaseLayerTree | OverlayLayerTree | null;
  isDelete: boolean;
}
