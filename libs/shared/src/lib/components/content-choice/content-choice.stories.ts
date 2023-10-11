import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { ContentChoiceComponent } from './content-choice.component';
import { ContentChoiceModule } from './content-choice.module';
import { CONTENT_TYPES } from '../../models/page.model';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

export default {
  component: ContentChoiceComponent,
  decorators: [
    moduleMetadata({
      imports: [ContentChoiceModule, FormsModule, ReactiveFormsModule],
      providers: [],
    }),
  ],
  tags: ['autodocs'],
  title: 'UI/Content Type Choice',
} as Meta;
/**
 * Defines a template for the component ContentChoiceComponent to use as a playground
 *
 * @param args the properties of the instance of ContentChoiceComponent
 * @returns the template
 */
const TEMPLATE: StoryFn<ContentChoiceComponent> = (args) => ({
  template:
    '<shared-content-choice [formControl]="type" [contentTypes]="contentTypes"></shared-content-choice>',
  props: {
    ...args,
    type: new UntypedFormControl(''),
  },
});

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',

  args: {
    contentTypes: CONTENT_TYPES,
  },
};
