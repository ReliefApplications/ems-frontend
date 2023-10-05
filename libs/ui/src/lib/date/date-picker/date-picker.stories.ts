import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { DatePickerComponent } from './date-picker.component';
import { StorybookTranslateModule } from '../../../storybook-translate.module';
import { DateModule } from '../date.module';

export default {
  title: 'Components/Date Picker',
  tags: ['autodocs'],
  component: DatePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [DateModule, ReactiveFormsModule, StorybookTranslateModule],
    }),
  ],
} as Meta<DatePickerComponent>;

/**
 * FormControl for story testing
 */
const formControl = new FormControl(new Date());

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
    <input [uiDatePicker] [formControl]="formControl" [label]="'Select a date'"/>
      <ui-date-picker #calendar>
      </ui-date-picker> 
      </div>
      <br>
      <p>selected value: {{formControl.value}}</p>
      `,
    props: {
      ...args,
      formControl,
    },
  };
};
/** Date picker */
export const DatePicker = DatePickerTemplate.bind({});

/**
 * Date picker bottom template
 *
 * @param {DatePickerComponent} args args
 * @returns DatePickerComponent
 */
const BottomDatePickerTemplate: StoryFn<DatePickerComponent> = (
  args: DatePickerComponent
) => {
  return {
    component: DatePickerComponent,
    template: `
    <p class="absolute">selected value: {{formControl.value}}</p>
    <div class="flex flex-col h-screen justify-end">
    <div [uiDateWrapper]="calendar">
    <input [uiDatePicker] [formControl]="formControl" [label]="'Select a date'"/>
      <ui-date-picker #calendar>
      </ui-date-picker> 
      </div>
      </div>
      `,
    props: {
      ...args,
      formControl,
    },
  };
};
/** Date picker bottom */
export const BottomDatePicker = BottomDatePickerTemplate.bind({});
