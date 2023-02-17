import { generateGeoJSONPoints } from './util-test';
import { merge, get } from 'lodash';
import 'leaflet.heat';
import * as L from 'leaflet';
import { SafeMapPopupService } from '../map-popup/map-popup.service';
import { haversineDistance } from '../utils/haversine';

type HeatMapOptions = {
  minOpacity: number;
  maxZoom: number;
  max: number;
  radius: number;
  blur: number;
  gradient: any;
};

/** Default heatmap options */
const defaultHeatMapOptions: HeatMapOptions = {
  gradient: {
    0: '#08d1d1',
    0.25: '#08d169',
    0.5: '#deba07',
    0.75: '#de6707',
    1: '#de0715',
  },
  max: 1.0,
  radius: 10,
  blur: 15,
  minOpacity: 0.5,
  maxZoom: 18,
};

/**
 * Generates a heatmap layer and adds it to the map
 * Also adds a click event to the map, which calculates the number of points
 * (from the heatmap)in a circle around the clicked point
 *
 * @param map The map to add the heatmap to
 * @param mapPopupService popup service to instantiate new popup component
 * @param options Options for the heatmap
 * @returns heatmap layer
 */
export const generateHeatMap = (
  map: any,
  mapPopupService: SafeMapPopupService,
  options?: Partial<HeatMapOptions>
) => {
  const total = 10000;
  const geoJSON = generateGeoJSONPoints(total, true);
  const heatArray: any[] = [];

  // Leaflet.heat doesn't support click events, so we have to do it ourselves
  map.on('click', (event: any) => {
    const layerClass = event.originalEvent.target?.className;
    // We are setting the click event in the whole map, so in order to trigger the popup for heatmap we filter the target from the heatmap
    if (typeof layerClass === 'string' && layerClass?.includes('heatmap')) {
      const zoom = map.getZoom();
      const radius = 1000 / zoom;
      const coordinates = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      };
      // checks if the point is within the calculate radius
      const matchedPoints = geoJSON.features.filter((point) => {
        const pointData = [
          point.geometry.coordinates[1],
          point.geometry.coordinates[0],
          get(point, 'properties.weight', 1),
        ];
        const distance = haversineDistance(
          event.latlng.lat,
          event.latlng.lng,
          pointData[0],
          pointData[1]
        );
        return distance < radius;
      });

      mapPopupService.setPopUp(matchedPoints, coordinates);
    }
  });

  geoJSON.features.forEach((feature: any) => {
    if (feature.geometry.type === 'Point') {
      heatArray.push([
        feature.geometry.coordinates[1], // lat
        feature.geometry.coordinates[0], // long
        get(feature, 'properties.weight', 1), // weight -> should be in properties.weight of the feature
      ]);
    }
  });

  const heatMapLayer = L.heatLayer(
    heatArray,
    merge(defaultHeatMapOptions, options)
  );

  // Leaflet.heat doesn't support click events, so we have to do it ourselves
  // heatMapLayer.on('click', (event: any) => {
  //   console.log(event);
  // });

  return heatMapLayer;
};
