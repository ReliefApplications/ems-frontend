import * as L from 'leaflet';
import { get, set } from 'lodash';

/** Interface for legend control options */
interface LegendControlOptions extends L.ControlOptions {
  container?: HTMLElement;
}

/**
 * Custom Legend control.
 */
class LegendControl extends L.Control {
  public override options: LegendControlOptions = {
    position: 'bottomleft',
    // layers: [],
  };
  private _map!: L.Map;
  private layers = {};

  /**
   * Custom leaflet legend control
   *
   * @param options legend control options
   */
  constructor(options?: LegendControlOptions) {
    super(options);
    // this.layers = options?.layers;
  }

  /**
   * Addition of legend control on map
   *
   * @param map leaflet map
   * @returns legend control container
   */
  public override onAdd(map: L.Map) {
    this._map = map;
    const container: HTMLElement =
      this.options.container ||
      L.DomUtil.create(
        'div',
        'leaflet-legend-control leaflet-bar p-3 max-h-52 overflow-y-auto bg-white bg-clip-border'
      );
    L.DomEvent.disableScrollPropagation(container).disableClickPropagation(
      container
    );
    container.innerHTML = this.innerHtml;
    if (container.innerHTML) {
      container.hidden = false;
    } else {
      container.hidden = true;
    }

    (map as any).legendControl = this;
    return container;
  }

  /** @returns inner html of container */
  get innerHtml() {
    if (this.layers) {
      const legend = document.createElement('div');
      legend.className = 'flex flex-col gap-2';

      for (const layer in this.layers) {
        const legendTxt = get(this.layers, layer);
        if (legendTxt) {
          const div = document.createElement('div');
          div.style.maxWidth = '150px';
          div.innerHTML = legendTxt;
          legend.appendChild(div);
        }
      }
      if (legend.innerHTML) {
        return legend.outerHTML;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  /**
   * Add layer to legend
   *
   * @param layer leaflet layer to add
   * @param legend legend to add
   */
  public addLayer(layer: L.Layer, legend: string) {
    set(this.layers, (layer as any)._leaflet_id, legend);
    this._update();
  }

  /**
   * Remove layer from legend
   *
   * @param layer Leaflet layer to remove
   */
  public removeLayer(layer: L.Layer) {
    set(this.layers, (layer as any)._leaflet_id, null);
    this._update();
  }

  /**
   * Update legend
   */
  _update(): void {
    const container = this.getContainer();
    if (!container) {
      return;
    }
    container.innerHTML = this.innerHtml;
    if (container.innerHTML) {
      container.hidden = false;
    } else {
      container.hidden = true;
    }
  }
}

/**
 * Generate a new legend control
 *
 * @param options legend control options
 * @returns legend control
 */
export const legendControl = (options?: LegendControlOptions) => {
  return new LegendControl(options);
};
