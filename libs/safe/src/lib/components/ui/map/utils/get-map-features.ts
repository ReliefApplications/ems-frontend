// In the future, maybe relocate this to a Map cl

import { Feature } from 'geojson';
import * as L from 'leaflet';

/**
 * Gets the map feature as a GeoJSON.
 *
 * @param map current map
 * @returns GeoJSON Feature
 */
export const getMapFeature = (map: any): Feature =>
  map.pm.getGeomanLayers().map((l: any) => {
    const json = l.toGeoJSON();
    json.options = l.options;
    // Adds radius property to circles,
    // as they are not supported by geojson
    if (l instanceof L.Circle) {
      json.properties.radius = l.getRadius();
    }
    if (l instanceof L.Marker) {
      const html =
        // eslint-disable-next-line no-unsafe-optional-chaining
        l.options.icon?.options && 'html' in l.options.icon?.options
          ? l.options.icon?.options.html
          : undefined;
      // save marker style info to geojson
      if (html) {
        const innerHtml = typeof html === 'string' ? html : html.innerHTML;
        const matches = innerHtml.match(/data-attr="(.*\d)"/);
        if (matches && matches.length > 1) {
          const attributes = matches[1];
          const [color, opacity] = attributes.split(',');
          json.properties = { color, opacity };
        }
      }
    }
    return json;
  })[0];

/**
 * Update Geoman layer position by type
 *
 * @param map Map on which geoman tools are set
 * @param data layer data
 * @param previousLayer previous layer
 * @param layerType geoman layer type
 */
export const updateGeoManLayerPosition = (
  map: L.Map | undefined,
  data: any,
  previousLayer?: L.Layer,
  layerType: string = 'Marker'
) => {
  if (previousLayer) {
    map?.removeLayer(previousLayer);
  }
  // We automatically add the marker there
  if (layerType === 'Marker') {
    (map as any).pm.enableDraw(layerType, { snappable: false });

    (map as any).pm.Draw[layerType]._createMarker({
      latlng: data.latlng,
    });
    (map as any).pm.disableDraw(layerType);
  }
};
