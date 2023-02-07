import 'leaflet.heat';
import { Feature, Point } from 'geojson';
import { generateRandomFeatures } from '../../generateFeatureCollection';

/**
 * Generates random heatmap points for testing
 * @returns Heatmap points for heat layer
 */
export const generateHeatLayerPoints = (): any => {
  const total = 10000;
  const geoJSON = generateRandomFeatures({
    numFeatures: total,
    Point: {
      generateProperties: () => {
        const weight = Math.random();
        const id = Math.random().toString(36).substring(2, 15);
        const title = `point_${id}`;
        const random = Math.random() > 0.5;
        return {
          id,
          weight,
          title,
          'marker-symbol': 'harbor',
          imgSrc: random
            ? 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg'
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/560px-Saturn_during_Equinox.jpg',
        };
      },
    },
  });
  const heatArray: Feature<Point>[] = [];
  geoJSON.features.forEach((feature) => {
    if (feature.geometry.type === 'Point') {
      heatArray.push(feature as Feature<Point>);
    }
  });
  return heatArray;
};
