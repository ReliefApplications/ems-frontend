import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { DateRangeComponent } from './date-range.component';
import { DateRangeModule } from './date-range.module';
import { DateWrapperDirective } from '../date-wrapper.directive';
import { DatePickerDirective } from '../date-picker.directive';

export default {
  title: 'Date Range',
  component: DateRangeComponent,
  decorators: [
    moduleMetadata({
      declarations: [DateWrapperDirective, DatePickerDirective],
      imports: [DateRangeModule],
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
    <div [uiDateWrapper]="calendar">
    <input uiDatePicker="'start'" [label]="'Select a start date'"/>
    <input uiDatePicker="'end'" [label]="'Select a end date'"/>
      <ui-date-range #calendar>
      </ui-date-range> 
      </div>`,
    props: {
      ...args,
    },
  };
};
/** Date range */
export const DateRange = DateRangeTemplate.bind({});
