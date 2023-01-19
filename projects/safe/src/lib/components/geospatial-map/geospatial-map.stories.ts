import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeGeospatialMapComponent } from './geospatial-map.component';
import { SafeGeospatialMapModule } from './geospatial-map.module';
// import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';

export default {
  component: SafeGeospatialMapComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeGeospatialMapModule /*, StorybookTranslateModule*/],
      providers: [],
    }),
  ],
  title: 'Form/Geospatial Map',
  argTypes: {},
} as Meta;

/**
 * Defines a template for the component SafeGeospatialMapComponent to use as a playground
 *
 * @param args the properties of the instance of SafeGeospatialMapComponent
 * @returns the template
 */
const TEMPLATE: Story<SafeGeospatialMapComponent> = (args) => ({
  props: {
    ...args,
  },
});

/** Exports a default template with mock properties */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [18.984375, -4.286158],
              [18.984375, 23.498514],
              [39.375, 23.498514],
              [39.375, -4.286158],
              [18.984375, -4.286158],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          radius: 2826283.732903213,
        },
        geometry: {
          type: 'Point',
          coordinates: [-27.773438, 18.245003],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [42.1875, 40.392581],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [65.742188, 39.854938],
            [71.367188, 27.620273],
            [90.351563, 32.486597],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-48.867188, -23.306946],
              [-41.835938, -20.6996],
              [-38.671875, -13.309449],
              [-34.684844, -6.369317],
              [-44.248386, -1.419278],
              [-55.898438, 0.28015],
              [-65.742188, 0.28015],
              [-70.664063, -3.9355],
              [-70.3125, -9.172602],
              [-61.523438, -13.309449],
              [-56.953125, -18.713894],
              [-56.25, -25.864167],
              [-54.492187, -32.606989],
              [-49.921875, -32.012734],
              [-48.867188, -23.306946],
            ],
          ],
        },
      },
    ],
  },
};
