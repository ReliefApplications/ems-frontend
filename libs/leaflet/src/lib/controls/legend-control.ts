import * as L from 'leaflet';

/** Interface for legend control options */
interface LegendControlOptions extends L.ControlOptions {
  container?: HTMLElement;
  layers?: L.Layer[];
}

/**
 * Custom leaflet legend control
 */
class LegendControl extends L.Control {
  public override options: LegendControlOptions = {
    position: 'bottomright',
  };
  private _map!: L.Map;
  public layers: L.Layer[] | [];

  /**
   * Custom leaflet legend control
   *
   * @param options legend control options
   * @param layers layers of the map
   */
  constructor(options?: LegendControlOptions, layers?: L.Layer[]) {
    super(options);
    this.layers = layers ? layers : [];
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
      L.DomUtil.create('div', 'leaflet-legend-control leaflet-bar');
    L.DomEvent.disableScrollPropagation(container).disableClickPropagation(
      container
    );
    container.style.backgroundColor = 'white';
    container.style.width = '300';
    container.innerHTML = 'Legend control';

    this.layers.forEach(
      (layer) =>
        (container.innerHTML =
          container.innerHTML + '<br>' + (layer as any).legend)
    );

    // if (this._layers.length) {
    //   this._load();
    // }
    return container;
  }
}

/**
 * Generate a new legend control
 *
 * @param options legend control options
 * @param layers layers to be displayed
 * @returns legend control
 */
export const legendControl = (
  options?: LegendControlOptions,
  layers?: L.Layer[]
) => {
  return new LegendControl(options, layers);
};
