import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { DateRangeComponent } from './date-range.component';
import { StorybookTranslateModule } from '../../../storybook-translate.module';
import { DateModule } from '../date.module';

export default {
  title: 'Components/Date Range',
  tags: ['autodocs'],
  component: DateRangeComponent,
  decorators: [
    moduleMetadata({
      imports: [DateModule, StorybookTranslateModule, ReactiveFormsModule],
    }),
  ],
} as Meta<DateRangeComponent>;

/**
 * Today date
 */
const today = new Date();

/**
 * After tomorrow date
 */
const afterTomorrow = new Date();

/**
 * FormControl for start date
 */
const formControlStart = new FormControl(today);

/**
 * FormControl for end date
 */
const formControlEnd = new FormControl(
  afterTomorrow.setDate(today.getDate() + 2)
);

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
    <input [uiDatePicker] [formControl]="formControlStart" [label]="'Select a start date'"/>
    <input [uiDatePicker] [formControl]="formControlEnd" [label]="'Select a end date'"/>
      <ui-date-range #calendar>
      </ui-date-range> 
      </div>
      <br>
      <p>start value: {{formControlStart.value}}</p>
      <p>end value: {{formControlEnd.value}}</p>`,
    props: {
      ...args,
      formControlStart,
      formControlEnd,
    },
  };
};
/** Date range */
export const DateRange = DateRangeTemplate.bind({});

/**
 * Date range bottom template
 *
 * @param {DateRangeComponent} args args
 * @returns DateRangeComponent
 */
const BottomDateRangeTemplate: StoryFn<DateRangeComponent> = (
  args: DateRangeComponent
) => {
  return {
    component: DateRangeComponent,
    template: `
    <div class="absolute">
    <p>start value: {{formControlStart.value}}</p>
    <p>end value: {{formControlEnd.value}}</p>
    </div>
    <div class="flex flex-col h-screen justify-end">
    <div [uiDateWrapper]="calendar">
    <input [uiDatePicker] [formControl]="formControlStart" [label]="'Select a start date'"/>
    <input [uiDatePicker] [formControl]="formControlEnd" [label]="'Select a end date'"/>
      <ui-date-range #calendar>
      </ui-date-range> 
      </div>
      </div>
      `,
    props: {
      ...args,
      formControlStart,
      formControlEnd,
    },
  };
};
/** Date range bottom */
export const BottomDateRange = BottomDateRangeTemplate.bind({});
