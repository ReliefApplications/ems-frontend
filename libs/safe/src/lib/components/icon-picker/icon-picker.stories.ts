import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';
import { IconPickerComponent } from './icon-picker.component';
import { IconPickerModule } from './icon-picker.module';

export default {
  component: IconPickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        IconPickerModule,
        FormsModule,
        ReactiveFormsModule,
        StorybookTranslateModule,
      ],
      providers: [
        {
          provide: 'environment',
          useValue: {
            theme: {
              primary: '#6f51ae',
            },
          },
        },
      ],
    }),
  ],
  title: 'UI/Icon Picker',
} as Meta;

/**
 * Defines a template for the component SafeContentChoiceComponent to use as a playground
 *
 * @param args the properties of the instance of SafeContentChoiceComponent
 * @returns the template
 */
const TEMPLATE: Story<IconPickerComponent> = (args) => ({
  template: '<safe-icon-picker [formControl]="formControl"></safe-icon-picker>',
  props: {
    ...args,
    formControl: new FormControl(''),
  },
});

/** Default template to export */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
// DEFAULT.args = {
//   contentTypes: CONTENT_TYPES,
// };
