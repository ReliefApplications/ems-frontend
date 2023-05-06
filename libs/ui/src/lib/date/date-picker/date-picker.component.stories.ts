import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { DatePickerComponent } from './date-picker.component';
import { DatePickerModule } from './date-picker.module';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { StorybookTranslateModule } from 'libs/ui/src/storybook-translate.module';

export default {
  title: 'Date Picker',
  component: DatePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        DatePickerModule,
        ReactiveFormsModule,
        StorybookTranslateModule,
      ],
    }),
  ],
} as Meta<DatePickerComponent>;

/**
 * FormControl for story testing
 */
const formControl = new FormControl();

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
    <input uiDatePicker [formControl]="formControl" [label]="'Select a date'"/>
      <ui-date-picker #calendar>
      </ui-date-picker> 
      </div>
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
