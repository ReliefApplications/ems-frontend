import { Meta, StoryFn } from '@storybook/angular';
import { SafeGroupStageComponent } from './group-stage.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {
  DEFAULT_FIELDS,
  SHARED_PIPELINE_STORIES_CONFIG,
} from '../shared-config/stories/config';

export default {
  component: SafeGroupStageComponent,
  ...SHARED_PIPELINE_STORIES_CONFIG,
  title: 'UI/Aggregation builder/Stages/Group',
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
const TEMPLATE: StoryFn<SafeGroupStageComponent> = () => ({
  template: '<safe-group-stage [form]=form [fields]=fields></safe-group-stage>',
  props: {
    // Need to pass formGroup there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    form: fb.group({
      groupBy: ['status', Validators.required],
      addFields: fb.array([]),
    }),
    fields: DEFAULT_FIELDS,
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
