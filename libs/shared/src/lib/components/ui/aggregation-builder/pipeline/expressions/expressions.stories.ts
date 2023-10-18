import { Meta, StoryFn } from '@storybook/angular';
import { ExpressionsComponent } from './expressions.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Accumulators } from './operators';
import {
  DEFAULT_FIELDS,
  SHARED_PIPELINE_STORIES_CONFIG,
} from '../shared/stories-config';

export default {
  component: ExpressionsComponent,
  tags: ['autodocs'],
  ...SHARED_PIPELINE_STORIES_CONFIG,
  title: 'UI/Aggregation builder/Stages/Expressions',
} as Meta;

/**
 * Form builder reference.
 */
const fb = new UntypedFormBuilder();

/**
 * Template used by storybook to display the component in stories.
 *
 * @returns story template
 */
const TEMPLATE: StoryFn<ExpressionsComponent> = () => ({
  template:
    '<shared-expressions [form]=form [fields]=fields [operators]=operators></shared-expressions>',
  props: {
    // Need to pass formGroup there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    form: fb.group({
      operator: ['', Validators.required],
      field: ['', Validators.required],
    }),
    fields: DEFAULT_FIELDS,
    operators: Accumulators,
  },
});

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',
  args: {},
};
