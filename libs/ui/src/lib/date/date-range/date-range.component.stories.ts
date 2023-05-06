import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { DateRangeComponent } from './date-range.component';
import { DateRangeModule } from './date-range.module';
import { StorybookTranslateModule } from 'libs/ui/src/storybook-translate.module';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'Date Range',
  component: DateRangeComponent,
  decorators: [
    moduleMetadata({
      imports: [DateRangeModule, StorybookTranslateModule, ReactiveFormsModule],
    }),
  ],
} as Meta<DateRangeComponent>;

/**
 * FormControl for story testing
 */
const formControlStart = new FormControl();

/**
 * FormControl for story testing
 */
const formControlEnd = new FormControl();

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
    <input [formControl]="formControlStart" uiDatePicker="'start'" [label]="'Select a start date'"/>
    <input [formControl]="formControlEnd" uiDatePicker="'end'" [label]="'Select a end date'"/>
      <ui-date-range #calendar>
      </ui-date-range> 
      </div>
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
