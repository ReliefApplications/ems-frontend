import * as L from 'leaflet';

/**
 * Custom class for heatmap layers
 */
export class GroupLayer extends L.LayerGroup {
  /**
   * Extension for leaflet layer
   *
   * @param layers layers to create the group from
   */
  constructor(layers?: L.Layer[]) {
    super(layers);
  }
  /**
   * Custom legend for the group layers
   *
   * @returns empty legend
   */
  get legend() {
    return '';
  }
}
