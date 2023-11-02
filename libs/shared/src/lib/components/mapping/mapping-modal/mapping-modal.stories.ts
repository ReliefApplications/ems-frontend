import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { MappingModalComponent } from './mapping-modal.component';
import { MappingModule } from '../mapping.module';
import { StorybookTranslateModule } from '../../storybook-translate/storybook-translate-module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export default {
  component: MappingModalComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        MappingModule,
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
          provide: DIALOG_DATA,
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
          provide: DialogRef,
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
const TEMPLATE: StoryFn<MappingModalComponent> = () => ({
  template: '<shared-mapping-modal></shared-mapping-modal>',
});

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Full',
  args: {},
};
