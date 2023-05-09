import * as L from 'leaflet';
import { get, set } from 'lodash';

/** Interface for legend control options */
interface LegendControlOptions extends L.ControlOptions {
  container?: HTMLElement;
  // layers: Layer[];
}

class LegendControl extends L.Control {
  public override options: LegendControlOptions = {
    position: 'bottomright',
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
    console.log('add legend control');
    this._map = map;
    const container: HTMLElement =
      this.options.container ||
      L.DomUtil.create('div', 'leaflet-legend-control leaflet-bar p-2');
    L.DomEvent.disableScrollPropagation(container).disableClickPropagation(
      container
    );
    container.style.backgroundColor = 'white';
    container.style.width = '300';
    container.innerHTML = this.innerHtml;

    (map as any).legendControl = this;
    return container;
  }

  get innerHtml() {
    const title = document.createElement('div');
    title.className = 'text-base font-bold';
    title.innerHTML = 'Legend';

    let legendHtml = '';
    for (const layer in this.layers) {
      const legend = get(this.layers, layer);
      if (legend) {
        legendHtml += legend;
      }
    }
    if (legendHtml) {
      const legend = document.createElement('div');
      legend.className = 'flex flex-col gap-1';
      legend.innerHTML = legendHtml;
      return title.outerHTML + legend.outerHTML;
    } else {
      return '';
    }
  }

  public addLayer(layer: L.Layer, legend: string) {
    set(this.layers, (layer as any)._leaflet_id, legend);
    this._update();
  }

  public removeLayer(layer: L.Layer) {
    set(this.layers, (layer as any)._leaflet_id, null);
    this._update();
  }

  _update() {
    const container = this.getContainer();
    if (!container) {
      return;
    }
    container.innerHTML = this.innerHtml;
  }
}

L.Map.include({
  legendControl: LegendControl,
});

/**
 * Generate a new legend control
 *
 * @param options legend control options
 * @returns legend control
 */
export const legendControl = (options?: LegendControlOptions) => {
  return new LegendControl(options);
};
