import * as L from 'leaflet';
import { SafeIconDisplayPipe } from '../../../../pipes/icon-display/icon-display.pipe';

/**
 * Custom class for heatmap layers
 */
export class ClusterLayer extends L.Layer {
  private color: string;
  private icon: string;
  private min: number;
  private max: number;
  private fontFamily: string;
  private pipe: SafeIconDisplayPipe;

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
    this.min = min ? min : 4;
    this.max = max ? max : 8;
    this.fontFamily = 'fa';
    this.pipe = new SafeIconDisplayPipe();
  }
  /**
   * Legend for cluster
   *
   * @returns legend for a cluster
   */
  get legend() {
    return (
      'Cluster layer <div class="flex flex-col gap-2">' +
      this.createClusterIcon(this.min) +
      this.createClusterIcon(this.max) +
      '</div>'
    );
  }

  /**
   * Creates a cluster icon with a custom size
   *
   * @param size Size of the cluster icon to create
   * @returns html for the cluster icon
   */
  private createClusterIcon(size: number) {
    return `<li class="flex items-center">
    <i style="color: ${this.color}; font-size: ${
      size * 3
    }px;" class="${this.pipe.transform(
      this.icon,
      this.fontFamily
    )}"></i><span class="text-base px-1">${size}</span> </li>
    `;
  }
}
