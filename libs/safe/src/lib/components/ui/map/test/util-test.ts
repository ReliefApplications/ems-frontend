/** Bound for the latitude in a map */
const latBounds = [-90, 90];
/** Bound for the longitude in a map */
const lngBounds = [-180, 180];

/**
 * Generates random GeoJSON points with a random latitude and longitude
 *
 * @param featuresCount The number of points to generate
 * @returns A GeoJSON FeatureCollection with the generated points
 */
export const generateGeoJSONPoints = (featuresCount: number = 100) => {
  const features = [];
  for (let i = 0; i < featuresCount; i++) {
    const lat =
      Math.random() * (latBounds[1] - latBounds[0] + 1) + latBounds[0];
    const lng =
      Math.random() * (lngBounds[1] - lngBounds[0] + 1) + lngBounds[0];
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
      },
    });
  }
  return {
    type: 'FeatureCollection',
    features,
  };
};
