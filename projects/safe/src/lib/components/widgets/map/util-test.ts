const latBounds = [-89, 89];
const lngBounds = [-179, 179];

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
        coordinates: [lat, lng],
      },
      properties: {
        title: 'point_' + i,
        'marker-symbol': 'harbor',
      },
    });
  }
  return {
    type: 'FeatureCollection',
    features,
  };
};
