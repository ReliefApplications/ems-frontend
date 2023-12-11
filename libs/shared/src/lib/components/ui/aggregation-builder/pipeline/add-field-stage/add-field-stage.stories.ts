import { Meta, StoryFn } from '@storybook/angular';
import { AddFieldStageComponent } from './add-field-stage.component';
import { UntypedFormBuilder } from '@angular/forms';
import { Accumulators } from '../expressions/operators';
import {
  DEFAULT_FIELDS,
  SHARED_PIPELINE_STORIES_CONFIG,
} from '../shared/stories-config';

export default {
  component: AddFieldStageComponent,
  tags: ['autodocs'],
  ...SHARED_PIPELINE_STORIES_CONFIG,
  title: 'UI/Aggregation builder/Stages/Add fields',
} as Meta;

/** Creating a new instance of the FormBuilder class. */
const fb = new UntypedFormBuilder();

/**
 * Defines a template for the component AddFieldStageComponent to use as/in a playground
 *
 * @returns the template
 */
const TEMPLATE: StoryFn<AddFieldStageComponent> = () => ({
  template:
    '<shared-add-field-stage [form]=form [fields]=fields [operators]=operators></shared-add-field-stage>',
  props: {
    // Need to pass formGroup there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    form: fb.array([]),
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
