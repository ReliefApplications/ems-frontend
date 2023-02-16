import { generateRandomFeatures } from './feature-collection-test';
import { LayerSettingsI } from '../interfaces/layer-settings.type';
import { GeoJSON } from '../interfaces/layer-settings.type';

/** Mock layer settings for testing the layer class */
export const MOCK_LAYER_SETTINGS: LayerSettingsI = {
  name: 'test group',
  type: 'group',
  children: [
    {
      name: 'test simple',
      type: 'feature',
      geojson: generateRandomFeatures({
        numFeatures: 10,
        Point: {
          generateProperties: () => {
            let count = 0;
            return {
              name: `Point ${count++}`,
            };
          },
          probability: 0.8,
        },
        Polygon: {
          generateProperties: () => ({}),
          probability: 0.2,
          numCoordinates: 4,
        },
      }) as GeoJSON,
      properties: {
        visibilityRange: [1, 18],
        opacity: 1,
        visibleByDefault: true,
      },
      filter: {
        condition: 'and',
        filters: [
          {
            field: 'name',
            operator: 'neq',
            value: 'Point 1',
          },
        ],
      },
      styling: [
        {
          filter: {
            condition: 'and',
            filters: [],
          },
          style: {
            fillOpacity: 0.5,
            borderOpacity: 0.5,
            fillColor: 'red',
            icon: 'fire',
          },
        },
      ],
      labels: {
        filter: {
          condition: 'and',
          filters: [],
        },
        label: '{{name}}',
        style: {
          color: '#000000',
          fontSize: 12,
          fontWeight: 'normal',
        },
      },
    },
    {
      name: 'test heatmap',
      type: 'heatmap',
      geojson: generateRandomFeatures({
        numFeatures: 1000,
        Point: {
          generateProperties: () => {
            let count = 0;
            return {
              name: `Point ${count++}`,
            };
          },
        },
      }) as GeoJSON,
      properties: {
        visibilityRange: [1, 18],
        opacity: 1,
        visibleByDefault: true,
      },
      styling: [
        {
          filter: {
            condition: 'and',
            filters: [],
          },
          style: {
            heatmap: {
              gradient: {
                0: 'pink',
                0.25: '#08d169',
                0.5: 'orange',
                0.75: 'purple',
                1: 'blue',
              },
              max: 1.0,
              radius: 10,
              blur: 15,
              minOpacity: 0.5,
              maxZoom: 18,
            },
          },
        },
      ],
    },
    {
      name: 'test cluster',
      type: 'cluster',
      geojson: generateRandomFeatures({
        numFeatures: 50,
        Point: {
          generateProperties: () => {
            let count = 0;
            return {
              name: `Point ${count++}`,
            };
          },
          maxDistance: 50,
        },
      }) as GeoJSON,
      properties: {
        visibilityRange: [1, 18],
        opacity: 1,
        visibleByDefault: true,
      },
      styling: [
        {
          filter: {
            condition: 'and',
            filters: [],
          },
          style: {
            fillColor: 'orange',
            fillOpacity: 1,
            icon: 'mug-hot',
            iconSize: 20,
          },
        },
      ],
    },
  ],
};
