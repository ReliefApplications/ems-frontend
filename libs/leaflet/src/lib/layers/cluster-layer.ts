import * as L from 'leaflet';

/**
 * Custom class for heatmap layers
 */
export class ClusterLayer extends L.Layer {
  /**
   * Legend for cluster
   *
   * @returns legend for a cluster
   */
  get legend() {
    return 'cluster legend';
  }
}
