import * as L from 'leaflet';
import { Gradient } from '../../../gradient-picker/gradient-picker.component';

/**
 * Custom class for heatmap layers
 */
export class HeatmapLayer extends L.Layer {
  private gradient: Gradient;

  /**
   * Class for heatmap layers, extends the default leaflet layer
   *
   * @param gradient Gradient of the heatmap
   */
  constructor(gradient: Gradient) {
    super();
    this.gradient = gradient;
  }

  /**
   * Legend for heatmap
   *
   * @returns legend for a heatmap
   */
  get legend() {
    let legend = 'Heatmap layer';
    this.gradient.forEach(
      (value) =>
        (legend =
          legend +
          `<li class="flex items-center py-0.5 px-1"><i style="background-color: ${value.color}" class="w-4 h-4 rounded-full"></i> <span class="text-base px-1">${value.ratio}</span></li>`)
    );
    return legend;
  }
}
