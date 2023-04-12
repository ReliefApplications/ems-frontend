import * as L from 'leaflet';

/**
 * Custom class for heatmap layers
 */
export class HeatmapLayer extends L.Layer {
  private gradient: { color: string; ratio: number };

  /**
   * Class for heatmap layers, extends the default leaflet layer
   *
   * @param gradient Gradient of the heatmap
   */
  constructor(gradient?: any) {
    super();
    this.gradient = gradient;
  }
  /**
   * Legend for heatmap
   *
   * @returns legend for a heatmap
   */
  get legend() {
    return `<div style="background: linear-gradient(to right, blue, red);"> test </div>`;
  }
}
