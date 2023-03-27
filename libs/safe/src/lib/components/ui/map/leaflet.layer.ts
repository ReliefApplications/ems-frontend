import * as L from 'leaflet';
import * as geojson from 'geojson';

/**
 * Custom geojson layer class, useful for custom methods
 */
export class GeoJSONLayer extends L.GeoJSON {
  /**
   * Custom geojson layer class, useful for custom methods
   *
   * @param geojson geojson object
   * @param options geojson options
   */
  constructor(geojson?: geojson.GeoJsonObject, options?: L.GeoJSONOptions) {
    super(geojson, options);
  }

  /** @returns layer legend */
  get legend() {
    return 'legend !';
  }
}

/**
 * Factory to create custom geojson layer class
 *
 * @param geojson geojson object
 * @param options geojson options
 * @returns custom geojson layer class
 */
export const geoJSONLayer = (
  geojson?: geojson.GeoJsonObject,
  options?: L.GeoJSONOptions
) => new GeoJSONLayer(geojson, options);
