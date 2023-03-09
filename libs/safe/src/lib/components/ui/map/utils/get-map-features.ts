// In the future, maybe relocate this to a Map cl

import { FeatureCollection } from 'geojson';
import * as L from 'leaflet';

/**
 * Gets the map features as a GeoJSON FeatureCollection.
 *
 * @param map current map
 * @returns GeoJSON FeatureCollection
 */
export const getMapFeatures = (map: any): FeatureCollection => ({
  type: 'FeatureCollection',
  features: map.pm.getGeomanLayers().map((l: any) => {
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
  }),
});
