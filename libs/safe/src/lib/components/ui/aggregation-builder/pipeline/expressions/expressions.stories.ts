import { Meta, StoryFn } from '@storybook/angular';
import { SafeExpressionsComponent } from './expressions.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Accumulators } from './operators';
import {
  SHARED_PIPELINE_STORIES_CONFIG,
  DEFAULT_FIELDS,
} from '../shared-config/stories/config';

export default {
  component: SafeExpressionsComponent,
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
const TEMPLATE: StoryFn<SafeExpressionsComponent> = () => ({
  template:
    '<safe-expressions [form]=form [fields]=fields [operators]=operators></safe-expressions>',
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
