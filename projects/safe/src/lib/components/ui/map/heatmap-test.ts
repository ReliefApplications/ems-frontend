import { generateGeoJSONPoints } from './util-test';
import 'leaflet.heat';
import { merge, get } from 'lodash';
import { haversineDistance } from './utils/haversine';

declare let L: any;

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
 * @param options Options for the heatmap
 */
export const generateHeatMap = (
  map: any,
  options?: Partial<HeatMapOptions>
) => {
  const total = 10000;
  const geoJSON = generateGeoJSONPoints(total);
  const heatArray: any[] = [];
  geoJSON.features.forEach((feature) => {
    if (feature.geometry.type === 'Point') {
      heatArray.push([
        feature.geometry.coordinates[1], // lat
        feature.geometry.coordinates[0], // long
        get(feature, 'properties.weight', 1), // weight -> should be in properties.weight of the feature
      ]);
    }
  });

  // Leaflet.heat doesn't support click events, so we have to do it ourselves
  map.on('click', (event: any) => {
    const zoom = map.getZoom();
    const coordinates = event.latlng;

    // there is a problem here, the radius should be different
    // depending on the latitude, because of the distortion of the Mercator projection
    // I couldn't get it to work, so I just used a fixed radius, based on the zoom level alone
    // https://en.wikipedia.org/wiki/Mercator_projection#Scale_factor
    // const mercatorScaleFactor = (latitude: number) => {
    //   const lat = (Math.PI / 180) * latitude;
    //   return (
    //     Math.cos(lat) /
    //     Math.sqrt(1 - Math.pow(Math.sin(lat), 2) * Math.pow(Math.E, 2))
    //   );
    // };

    const radius = 1000 / zoom;

    // checks if the point is within the calculate radius
    const heatMapPoints = heatArray.filter((heatMapPoint) => {
      const distance = haversineDistance(
        coordinates.lat,
        coordinates.lng,
        heatMapPoint[0],
        heatMapPoint[1]
      );

      return distance < radius;
    });

    if (heatMapPoints.length > 0) {
      // create a circle around the point (for debugging)
      const circle = L.circle(coordinates, {
        radius: radius * 1000, // haversineDistance returns km, circle radius is in meters
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
      });
      circle.addTo(map);
      // create a popup with the number of points in the area and the coordinates
      const popup = L.popup()
        .setLatLng(coordinates)
        .setContent(
          `Number of points in the area: ${heatMapPoints.length} <br> Coordinates: ${coordinates.lat}, ${coordinates.lng}`
        );
      circle.bindPopup(popup);
      popup.on('remove', () => map.removeLayer(circle));
      circle.openPopup();
    }
  });

  const heatMapLayer = L.heatLayer(
    heatArray,
    merge(defaultHeatMapOptions, options)
  );
  heatMapLayer.on('click', (event: any) => {
    console.log(event);
  });
  console.log(heatMapLayer);
  heatMapLayer.addTo(map);
};
