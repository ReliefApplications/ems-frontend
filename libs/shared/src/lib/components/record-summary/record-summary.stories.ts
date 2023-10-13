import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { RecordSummaryModule } from './record-summary.module';
import { RecordSummaryComponent } from './record-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';

export default {
  component: RecordSummaryComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        RecordSummaryModule,
        BrowserAnimationsModule,
        RecordSummaryModule,
        StorybookTranslateModule,
      ],
      providers: [],
    }),
  ],
  title: 'Form/Record Summary',
  argTypes: {
    record: {
      control: { type: 'object' },
    },
    cacheDate: {
      control: { type: 'date' },
    },
  },
} as Meta;

/**
 * Defines a template for the component RecordSummaryComponent to use as a playground
 *
 * @param args the properties of the instance of RecordSummaryComponent
 * @returns the template
 */
const Template: StoryFn<RecordSummaryComponent> = (
  args: RecordSummaryComponent
) => ({
  props: args,
});

/**
 * Default story.
 */
export const Default = Template.bind({});
Default.args = {
  record: {
    createdBy: {
      name: 'Dummy',
    },
    createdAt: new Date(),
    modifiedBy: {
      name: 'Dummy',
    },
    modifiedAt: new Date(),
  },
  cacheDate: new Date(),
};
//  = {
//   render: TEMPLATE,
//   name: 'Default',

//   args: {
//     record: {
//       createdBy: {
//         name: 'Dummy',
//       },
//       createdAt: new Date(),
//       modifiedBy: {
//         name: 'Dummy',
//       },
//       modifiedAt: new Date(),
//     },
//     cacheDate: new Date(),
//   },
// };

/**
 * Cache only story.
 */
// export const CACHE_ONLY = {
//   render: TEMPLATE,
//   name: 'Cache only',

//   args: {
//     cacheDate: new Date(),
//   },
// };

/**
 * Without cache story.
 */
// export const WITHOUT_CACHE = {
//   render: TEMPLATE,
//   name: 'Without cache',

//   args: {
//     record: {
//       createdBy: {
//         name: 'Dummy',
//       },
//       createdAt: new Date(),
//       modifiedBy: {
//         name: 'Dummy',
//       },
//       modifiedAt: new Date(),
//     },
//   },
// };
