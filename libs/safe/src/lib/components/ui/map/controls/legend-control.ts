import * as L from 'leaflet';
import { Layer } from '../layer';
import { ClusterLayer } from '../map-layers/cluster-layer';
import { HeatmapLayer } from '../map-layers/heatmap-layer';
import { FeatureLayer } from '../map-layers/feature-layer';
import { GroupLayer } from '../map-layers/group-layer';
import { SketchLayer } from '../map-layers/sketch-layer';

/** Interface for legend control options */
interface LegendControlOptions extends L.ControlOptions {
  container?: HTMLElement;
  layers: Layer[];
}

/**
 * Custom leaflet legend control
 */
class LegendControl extends L.Control {
  public override options: LegendControlOptions = {
    position: 'bottomright',
    layers: [],
  };
  private _map!: L.Map;
  public layers: Layer[];

  /**
   * Custom leaflet legend control
   *
   * @param options legend control options
   */
  constructor(options: LegendControlOptions) {
    super(options);
    this.layers = options?.layers;
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

    this.layers
      .map((layer: Layer) => {
        switch (layer.type) {
          case 'cluster':
            return layer.getLayer() as ClusterLayer;
          case 'heatmap':
            return { ...layer.getLayer() } as HeatmapLayer;
          case 'feature':
            return new FeatureLayer(layer.data, '', '');
          case 'group':
            return layer.getLayer() as GroupLayer;
          case 'sketch':
            return layer.getLayer() as SketchLayer;
        }
      })
      .forEach((leafletLayer) => {
        console.log('type', leafletLayer instanceof FeatureLayer);
        container.innerHTML =
          container.innerHTML + '<br>' + leafletLayer.legend;
      });

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
export const legendControl = (options: LegendControlOptions) => {
  return new LegendControl(options);
};
