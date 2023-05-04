import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DatePickerComponent } from './date-picker.component';
import { ButtonModule } from '../button/button.module';

export default {
  title: 'Date Picker',
  component: DatePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ButtonModule,
        BrowserAnimationsModule,
        IntlModule,
        DateInputsModule,
        LabelModule,
        ButtonsModule,
      ],
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
      <ui-date-picker [isRange]="true"><ng-container ngProjectAs="label">Select a data</ng-container></ui-date-picker> `,
    props: {
      ...args,
    },
  };
};
/** Date picker */
export const DatePicker = DatePickerTemplate.bind({});
