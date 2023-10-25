import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';
import { IconPickerComponent } from './icon-picker.component';
import { IconPickerModule } from './icon-picker.module';
import { FormWrapperModule } from '@oort-front/ui';
import { importProvidersFrom } from '@angular/core';

export default {
  title: 'UI/Icon Picker',
  component: IconPickerComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(StorybookTranslateModule)],
    }),
    moduleMetadata({
      imports: [
        IconPickerModule,
        FormsModule,
        ReactiveFormsModule,
        FormWrapperModule,
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
} as Meta;

type Story = StoryObj<IconPickerComponent>;

/** Default story */
export const Default: Story = {
  render: () => ({
    props: {
      formControl: new FormControl(''),
      placeholder: 'Click to select an icon',
    },
    template:
      '<div uiFormFieldDirective><shared-icon-picker [formControl]="formControl" [placeholder]="placeholder"></shared-icon-picker></div>',
  }),
};
