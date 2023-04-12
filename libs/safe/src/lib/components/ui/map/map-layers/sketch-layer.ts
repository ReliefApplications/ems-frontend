import * as L from 'leaflet';

/**
 * Custom class for heatmap layers
 */
export class SketchLayer extends L.Layer {
  /**
   * Custom legend for the sketch layers
   *
   * @returns empty legend
   */
  get legend() {
    return '';
  }
}
