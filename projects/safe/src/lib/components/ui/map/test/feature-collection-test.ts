// Declares L to be able to use Leaflet from CDN
declare let L: any;

/** Represents the types of geometries that can be generated */
type FeatureTypes = 'Point' | 'Polygon' | 'LineString';

/** Options for generating random features */
type CollectionGeneratorOptions = {
  [key in FeatureTypes]?: {
    generateProperties: () => any;
    probability?: number;
    numCoordinates?: number;
    maxDistance?: number;
    minDistance?: number;
  };
} & {
  numFeatures: number;
};

/** Default max distance in degrees */
const DEFAULT_MAX_DISTANCE = 15;

/** Default min distance in degrees */
const DEFAULT_MIN_DISTANCE = 5;

/** Location icon svg */
const LOCATION_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M396.6 6.5L235.8 129.1c9.6 1.8 18.9 5.8 27 12l168 128c13.2 10.1 22 24.9 24.5 41.4l6.2 41.5H608c9.3 0 18.2-4.1 24.2-11.1s8.8-16.4 7.4-25.6l-24-160c-1.2-8.2-5.6-15.7-12.3-20.7l-168-128c-11.5-8.7-27.3-8.7-38.8 0zm-153.2 160c-11.5-8.7-27.3-8.7-38.8 0l-168 128c-6.6 5-11 12.5-12.3 20.7l-24 160c-1.4 9.2 1.3 18.6 7.4 25.6S22.7 512 32 512H224V352l96 160h96c9.3 0 18.2-4.1 24.2-11.1s8.8-16.4 7.4-25.6l-24-160c-1.2-8.2-5.6-15.7-12.3-20.7l-168-128z"/></svg>';

/**
 * Generates random features based on the specified options
 *
 * @param options Options for generating random features
 * @returns Array of generated features
 */
export const generateRandomFeatures = (options: CollectionGeneratorOptions) => {
  const featureTypes = Object.keys(options) as FeatureTypes[];
  const typeProbabilities = featureTypes.reduce((probabilities, type) => {
    const prob = options[type]?.probability;
    if (prob !== undefined) {
      probabilities[type] = prob;
    }
    return probabilities;
  }, {} as { [key in FeatureTypes]: number });

  const features = [];
  for (let i = 0; i < options.numFeatures; i++) {
    const type = weightedRandom(featureTypes, typeProbabilities);
    const option = options[type];
    if (!option) continue;
    const properties = option.generateProperties();
    const maxDistance = option.maxDistance || DEFAULT_MAX_DISTANCE;
    const minDistance = option.minDistance || DEFAULT_MIN_DISTANCE;
    let coordinates;
    switch (type) {
      case 'Point':
        coordinates = [Math.random() * 180 - 90, Math.random() * 360 - 180];
        break;
      case 'Polygon':
      case 'LineString':
        const numCoordinates = options[type]?.numCoordinates || 3;
        coordinates = [];
        let previousLat = 0;
        let previousLng = 0;
        for (let j = 0; j < numCoordinates; j++) {
          let lat = Math.random() * 180 - 90;
          let lng = Math.random() * 360 - 180;
          if (j !== 0) {
            let latDifference = Math.abs(previousLat - lat);
            let lngDifference = Math.abs(previousLng - lng);
            while (
              latDifference > maxDistance ||
              lngDifference > maxDistance ||
              latDifference < minDistance ||
              lngDifference < minDistance
            ) {
              lat = Math.random() * 180 - 90;
              lng = Math.random() * 360 - 180;
              latDifference = Math.abs(previousLat - lat);
              lngDifference = Math.abs(previousLng - lng);
            }
          }
          previousLat = lat;
          previousLng = lng;
          coordinates.push([lat, lng]);
        }
        if (type === 'Polygon') {
          coordinates = [coordinates];
        }
        break;
    }
    features.push({ type, properties, coordinates });
  }
  return {
    type: 'FeatureCollection',
    features: features.map((feature) => ({
      type: 'Feature',
      properties: feature.properties,
      geometry: {
        type: feature.type,
        coordinates: feature.coordinates,
      },
    })),
  };
};

/**
 * Returns a random item from the given options based on the weights provided.
 *
 * @param options - Array of options to choose from
 * @param weights - Array of weights for each option
 * @returns The randomly selected item from the options array
 */
const weightedRandom = (
  options: FeatureTypes[],
  weights: { [key in FeatureTypes]: number }
) => {
  let sum = 0;
  const keys = Object.keys(weights) as FeatureTypes[];
  for (const key of keys) {
    sum += weights[key];
  }

  const randomNum = Math.random() * sum;
  let weightSum = 0;
  for (const key of options) {
    weightSum += weights[key];
    if (randomNum <= weightSum) {
      return key;
    }
  }
  return options[options.length - 1];
};

/** Random feature collection */
export const randomFeatureCollection = generateRandomFeatures({
  Point: {
    generateProperties: () => {
      if (Math.random() < 0.3) return {};
      // get random color
      const color = Math.floor(Math.random() * 16777215).toString(16);
      const width = Math.floor(Math.random() * 10) + 20;
      return {
        icon: {
          svg: LOCATION_ICON_SVG,
          color: `#${color}`,
          width,
          height: width,
        },
      };
    },
    probability: 0.9,
  },
  Polygon: {
    generateProperties: () => ({}),
    probability: 0.1,
    numCoordinates: 4,
  },
  // LineString: {
  //   generateProperties: () => ({}),
  //   probability: 0.5,
  //   numCoordinates: 3,
  // },
  numFeatures: 20,
});

export const geoJsonLayer = (geojson: any) =>
  L.geoJSON(geojson, {
    // Check for icon property
    pointToLayer: (feature: any, latlng: any) => {
      const marker = L.marker(latlng);
      if (feature.properties?.icon?.svg) {
        const color = feature.properties.icon.color;
        const width = feature.properties.icon.width;
        const height = feature.properties.icon.height;
        const svg = feature.properties.icon.svg;

        const icon = L.divIcon({
          className: 'svg-marker',
          iconSize: [width, height],
          iconAnchor: [0, 24],
          labelAnchor: [-6, 0],
          popupAnchor: [width / 2, -36],
          html: `<span style="--color:${color}">${svg}</span>`,
        });

        return marker.setIcon(icon);
      }
      return marker;
    },
  });
