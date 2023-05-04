import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { DateRangeComponent } from './date-range.component';
import { ButtonModule } from '../button/button.module';

export default {
  title: 'Date Range',
  component: DateRangeComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
} as Meta<DateRangeComponent>;

/**
 * Date range template
 *
 * @param {DateRangeComponent} args args
 * @returns DateRangeComponent
 */
const DateRangeTemplate: StoryFn<DateRangeComponent> = (
  args: DateRangeComponent
) => {
  return {
    component: DateRangeComponent,
    template: `
      <ui-date-range><ng-container ngProjectAs="label">Select a data</ng-container></ui-date-range> `,
    props: {
      ...args,
    },
  };
};
/** Date range */
export const DateRange = DateRangeTemplate.bind({});
