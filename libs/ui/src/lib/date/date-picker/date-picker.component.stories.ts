import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { DatePickerComponent } from './date-picker.component';
import { DatePickerModule } from './date-picker.module';
import { DateWrapperDirective } from '../date-wrapper.directive';
import { DatePickerDirective } from '../date-picker.directive';

export default {
  title: 'Date Picker',
  component: DatePickerComponent,
  decorators: [
    moduleMetadata({
      declarations: [DateWrapperDirective, DatePickerDirective],
      imports: [DatePickerModule],
    }),
  ],
} as Meta<DatePickerComponent>;

/**
 * Date picker template
 *
 * @param {DatePickerComponent} args args
 * @returns DatePickerComponent
 */
const DatePickerTemplate: StoryFn<DatePickerComponent> = (
  args: DatePickerComponent
) => {
  return {
    component: DatePickerComponent,
    template: `
    <div [uiDateWrapper]="calendar">
    <input uiDatePicker [label]="'Select a date'"/>
      <ui-date-picker #calendar>
      </ui-date-picker> 
      </div>
      `,
    props: {
      ...args,
    },
  };
};
/** Date picker */
export const DatePicker = DatePickerTemplate.bind({});
