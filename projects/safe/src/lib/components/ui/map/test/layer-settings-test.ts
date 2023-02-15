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
      type: 'simple',
      geojson: generateRandomFeatures({
        numFeatures: 10,
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
      styling: [],
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
  ],
};
