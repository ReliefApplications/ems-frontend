import { Feature } from 'geojson';

/** Bound for the latitude in a map */
const latBounds = [-90, 90];
/** Bound for the longitude in a map */
const lngBounds = [-180, 180];

/**
 * Generates random GeoJSON points with a random latitude and longitude
 *
 * @param featuresCount The number of points to generate
 * @param isHeatMap Testing param to add different properties to the feature popup
 * @returns A GeoJSON FeatureCollection with the generated points
 */
export const generateGeoJSONPoints = (
  featuresCount: number = 100,
  isHeatMap: boolean = false
) => {
  const features: Feature<any>[] = [];
  for (let i = 0; i < featuresCount; i++) {
    const lat =
      Math.random() * (latBounds[1] - latBounds[0] + 1) + latBounds[0];
    const lng =
      Math.random() * (lngBounds[1] - lngBounds[0] + 1) + lngBounds[0];
    const random = Math.random() > 0.5;
    const id = Math.random().toString(36).substring(2, 15);
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        title: 'point_' + i,
        'marker-symbol': 'harbor',
        weight: 1, // for heatmap -> if there is no other field, that should just be one
        id,
        imgSrc: random
          ? 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg'
          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/560px-Saturn_during_Equinox.jpg',
        // Additional mocked properties to check popup components loads the given properties
        ...(isHeatMap && {
          property: 'property1',
          parkingLot: Math.floor(Math.random() * (featuresCount - 1 + 1) + 1),
        }),
      },
    });
  }
  return {
    type: 'FeatureCollection',
    features,
  };
};
