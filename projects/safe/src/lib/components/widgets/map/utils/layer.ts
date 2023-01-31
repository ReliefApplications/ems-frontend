import { testLegend as MOCKED_LEGEND } from '../geojson-test';

/** Interface for a layer legends */
export type LayerLegendI = (
  | {
      type: 'marker';
      items: {
        label: string;
        color: string;
        icon: string;
      }[];
    }
  | {
      type: 'polygon';
      items: {
        label: string;
        color: string;
      }[];
    }
  | {
      type: 'cluster';
      color: string;
      sizes: {
        label: string;
        radius: number;
      }[];
    }
  | {
      type: 'heatmap';
      gradient: {
        value: number;
        color: string;
        label: string;
      }[];
    }
) & { title: string; layer: L.Layer };

/** Interface for the map layer form */
export interface LayerFormI {
  name: string;
}

/** Class map layer logic */
export class Layer {
  private name: string;
  /**
   * Class map layer logic
   *
   * @param layer form value of the layer
   */
  constructor(layer: LayerFormI) {
    this.name = layer.name;
  }

  // /**
  //  * Gets the layer legends
  //  *
  //  * @returns the layer legends
  //  */
  // getLegends(): LayerLegendI[] {
  //   ... calculate legends
  // }

  /** @returns mocked legends, TO BE REMOVED */
  static getLegends(): LayerLegendI[] {
    return MOCKED_LEGEND as LayerLegendI[];
  }
}
