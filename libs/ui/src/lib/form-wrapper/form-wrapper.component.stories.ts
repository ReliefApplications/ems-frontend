import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { FormWrapperComponent } from './form-wrapper.component';
import { CommonModule } from '@angular/common';
import { FormWrapperModule } from './form-wrapper.module';

export default {
  title: 'FormWrapperComponent',
  component: FormWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormWrapperModule],
    }),
  ],
} as Meta<FormWrapperComponent>;

/**
 * Template to create form wrapper component's story
 *
 * @param args args
 * @returns StoryFn<FormWrapperComponent> story
 */
const Template: StoryFn<FormWrapperComponent> = (
  args: FormWrapperComponent
) => ({
  props: args,
});

/**
 * Outline = False design
 */
export const OutlineFalse = Template.bind({});
OutlineFalse.args = {
  outline: false,
};

/**
 * Outline = True design
 */
export const OutlineTrue = Template.bind({});
OutlineTrue.args = {
  outline: true,
};
