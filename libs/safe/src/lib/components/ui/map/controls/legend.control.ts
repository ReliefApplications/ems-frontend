import * as L from 'leaflet';
import { get, set } from 'lodash';

/** Interface for legend control options */
interface LegendControlOptions extends L.ControlOptions {
  container?: HTMLElement;
  // layers: Layer[];
}

class LegendControl extends L.Control {
  private legends: any;

  public override options: LegendControlOptions = {
    position: 'bottomright',
    // layers: [],
  };
  private _map!: L.Map;
  // public layers: Layer[];

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
      L.DomUtil.create('div', 'leaflet-legend-control leaflet-bar');
    L.DomEvent.disableScrollPropagation(container).disableClickPropagation(
      container
    );
    container.style.backgroundColor = 'white';
    container.style.width = '300';
    container.innerHTML = 'Legend control';

    // for (const legend of this.legends) {
    //   console.log(legend);
    // }

    // this.layers
    //   .map((layer: Layer) => {
    //     switch (layer.type) {
    //       case 'cluster':
    //         return layer.getLayer() as ClusterLayer;
    //       case 'heatmap':
    //         return { ...layer.getLayer() } as HeatmapLayer;
    //       case 'feature':
    //         return new FeatureLayer(layer.data, '', '');
    //       case 'group':
    //         return layer.getLayer() as GroupLayer;
    //       case 'sketch':
    //         return layer.getLayer() as SketchLayer;
    //     }
    //   })
    //   .forEach((leafletLayer) => {
    //     console.log('type', leafletLayer instanceof FeatureLayer);
    //     container.innerHTML =
    //       container.innerHTML + '<br>' + leafletLayer.legend;
    //   });

    // if (this._layers.length) {
    //   this._load();
    // }
    console.log(this);
    (map as any).legendControl = this;
    return container;
  }

  public addLayer(layer: L.Layer, legend: string) {
    console.log(layer);
    console.log(get(layer, '_leaflet_id'));
    // set(this.legends, layer._leaflet_id, legend);
    console.log('add layer');
    this.onAdd(this._map);
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
