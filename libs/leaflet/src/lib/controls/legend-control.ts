import * as L from 'leaflet';

/** Interface for legend control options */
interface LegendControlOptions extends L.ControlOptions {
  container?: HTMLElement;
}

/**
 * Custom leaflet legend control
 */
class LegendControl extends L.Control {
  public override options: LegendControlOptions = {
    position: 'bottomright',
  };
  private _map!: L.Map;

  /**
   * Custom leaflet legend control
   *
   * @param options legend control options
   */
  constructor(options?: LegendControlOptions) {
    super(options);
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

    container.innerHTML = 'legend control';

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
 * @returns legend control
 */
export const legendControl = (options?: LegendControlOptions) => {
  return new LegendControl(options);
};
