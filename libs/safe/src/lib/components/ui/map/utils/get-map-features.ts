// In the future, maybe relocate this to a Map cl

import { Feature } from 'geojson';
import * as L from 'leaflet';
import { ReverseGeocodeResult } from '../../../geospatial-map/geospatial-map.component';

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
 * Map the given geolocation to our ReverseGeocodeResult interface
 *
 * @param geolocationData Geolocation Data
 * @returns ReverseGeoCodeResult
 */
export const mapGeolocationData = (
  geolocationData: any
): ReverseGeocodeResult => {
  return {
    Coordinates: geolocationData.latlng,
    City: geolocationData.address.City,
    Country: geolocationData.address.CntryName,
    District: geolocationData.address.District,
    Region: geolocationData.address.Region,
    Street: geolocationData.address.ShortLabel,
  };
};

/**
 * Update Geoman layer position by type
 *
 * @param map Map on which geoman tools are set
 * @param data layer data
 * @param layerType geoman layer type
 */
export const updateGeoManLayerPosition = (
  map: L.Map,
  data: any,
  layerType: string = 'Marker'
) => {
  const layers = (map as any).pm.getGeomanLayers();
  // If the layer was previously added we remove it
  if (layers.length) {
    layers.forEach((l: any) => {
      map.removeLayer(l);
    });
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
