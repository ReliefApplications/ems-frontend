import * as Vector from 'esri-leaflet-vector';
import { BASEMAP_LAYERS } from '../const/baseMaps';

type BaseTreeChildren = {
  label: string;
  layer: any;
}[];

/**
 * Generates the basemaps object that allow us to have multiple
 * basemaps in the map and switch between them in the layer control.
 *
 * @param esriApiKey api key
 * @param defaultBaseMap basemap layer of the default basemap used when initializing the SafeMapComponent
 * @returns object of the type BaseTreeChildren
 */
export const generateBaseMaps = (esriApiKey: string, defaultBaseMap: any) => {
  const baseMaps: BaseTreeChildren = [];

  for (const [key, value] of Object.entries(BASEMAP_LAYERS)) {
    const basemap = Vector.vectorBasemapLayer(value, {
      apiKey: esriApiKey,
    });

    // The key === 'OSM' check is only needed
    // so the basemap set in the map component when
    // drawing the map is selected in the layer control
    baseMaps.push({
      label: key,
      layer: key === 'OSM' ? defaultBaseMap : basemap,
    });
  }
  return baseMaps;
};
