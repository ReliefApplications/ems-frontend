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
 */
export const updateGeoManLayerPosition = (
  map: L.Map | undefined,
  data: Feature,
  previousLayer?: L.Layer
) => {
  if (!map) {
    return;
  }

  if (previousLayer) {
    map?.removeLayer(previousLayer);
  }

  if (data.geometry.type === 'Point') {
    // Draw a marker
    map.pm.enableDraw('Marker', { snappable: false });

    const latlng = new L.LatLng(
      data.geometry.coordinates[1],
      data.geometry.coordinates[0]
    );

    (map.pm.Draw as any).Marker._createMarker({
      latlng,
    });

    map.pm.disableDraw('Marker');
  } else if (data.geometry.type === 'Polygon') {
    // Create the polygon and add it to the map
    const polygon = L.polygon(
      data.geometry.coordinates[0].map((c: any) => {
        return new L.LatLng(c[1], c[0]);
      })
    );

    map.addLayer(polygon);
  } else if (data.geometry.type === 'LineString') {
    // Create the polyline and add it to the map
    const polyline = L.polyline(
      data.geometry.coordinates.map((c: any) => {
        return new L.LatLng(c[1], c[0]);
      })
    );

    map.addLayer(polyline);
  }
};
