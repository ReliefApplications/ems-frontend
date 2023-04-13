import * as L from 'leaflet';

/**
 * Custom class for heatmap layers
 */
export class GroupLayer extends L.Layer {
  /**
   * Custom legend for the group layers
   *
   * @returns empty legend
   */
  get legend() {
    return '';
  }
}
