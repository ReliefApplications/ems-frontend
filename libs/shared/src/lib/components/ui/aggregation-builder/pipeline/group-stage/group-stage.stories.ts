import { Meta, StoryFn } from '@storybook/angular';
import { GroupStageComponent } from './group-stage.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {
  SHARED_PIPELINE_STORIES_CONFIG,
  DEFAULT_FIELDS,
} from '../shared/stories-config';

export default {
  component: GroupStageComponent,
  tags: ['autodocs'],
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
const TEMPLATE: StoryFn<GroupStageComponent> = () => ({
  template:
    '<shared-group-stage [form]=form [fields]=fields></shared-group-stage>',
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
