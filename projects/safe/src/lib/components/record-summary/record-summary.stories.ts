import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeRecordSummaryModule } from './record-summary.module';
import { SafeRecordSummaryComponent } from './record-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeRecordSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, SafeRecordSummaryModule],
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
 * Defines a template for the component SafeRecordSummaryComponent to use as a playground
 *
 * @param args the properties of the instance of SafeRecordSummaryComponent
 * @returns the template
 */
const TEMPLATE: Story<SafeRecordSummaryComponent> = (args) => ({
  props: {
    ...args,
  },
});

/** Exports a default template with mock properties */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
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

/** Exports a template with properties that model information only stored in the cache */
export const CACHE_ONLY = TEMPLATE.bind({});
CACHE_ONLY.storyName = 'Cache only';
CACHE_ONLY.args = {
  cacheDate: new Date(),
};

/** Exports a template with properties that model information not stored in the cache */
export const WITHOUT_CACHE = TEMPLATE.bind({});
WITHOUT_CACHE.storyName = 'Without cache';
WITHOUT_CACHE.args = {
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
};
