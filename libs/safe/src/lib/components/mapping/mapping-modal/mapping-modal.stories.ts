import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeMappingModalComponent } from './mapping-modal.component';
import { SafeMappingModule } from '../mapping.module';
import { StorybookTranslateModule } from '../../storybook-translate/storybook-translate-module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';

export default {
  component: SafeMappingModalComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeMappingModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: 'environment',
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mapping: {
              field: 'externalAttributes.region',
              path: 'userBaseLocation.region',
              value: 'id',
              text: 'name',
            },
          },
        },
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }),
  ],
  title: 'UI/Mapping/Modal',
  args: {
    data: {
      field: 'externalAttributes.region',
      path: 'userBaseLocation.region',
      value: 'id',
      text: 'name',
    },
  },
} as Meta;

/**
 * Template for stories
 *
 * @returns story
 */
const TEMPLATE: Story<SafeMappingModalComponent> = () => ({
  template: '<safe-mapping-modal></safe-mapping-modal>',
});

/**
 * Default story
 */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Full';
DEFAULT.args = {};
