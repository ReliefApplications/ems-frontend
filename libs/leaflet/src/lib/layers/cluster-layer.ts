import * as L from 'leaflet';

/**
 * Custom class for heatmap layers
 */
export class ClusterLayer extends L.Layer {
  private color: string;
  private icon: string;
  private min: number;
  private max: number;

  /**
   * Class for cluster layers, extends the default leaflet layer
   *
   * @param color Color of the cluster icon
   * @param icon Symbol of the cluster icon
   * @param min Minimum size of the cluster
   * @param max Maximum size of the cluster
   */
  constructor(color?: string, icon?: string, min?: number, max?: number) {
    super();
    this.color = color ? color : '';
    this.icon = icon ? icon : '';
    this.min = min ? min : 0;
    this.max = max ? max : 0;
  }
  /**
   * Legend for cluster
   *
   * @returns legend for a cluster
   */
  get legend() {
    return `<i class="fas fa-dragon"></i>`;
  }
}
