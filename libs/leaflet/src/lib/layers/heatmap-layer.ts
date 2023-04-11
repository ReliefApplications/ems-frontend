import * as L from 'leaflet';

/**
 * Custom class for heatmap layers
 */
export class HeatmapLayer extends L.Layer {
  /**
   * Legend for heatmap
   *
   * @returns legend for a heatmap
   */
  get legend() {
    return 'heatmap legend';
  }
}
