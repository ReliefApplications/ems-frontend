import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormWrapperModule } from './form-wrapper.module';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';

export default {
  title: 'Form Wrapper',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormWrapperModule, IconModule, SpinnerModule],
    }),
  ],
} as Meta<any>;

/**
 * Template to create form wrapper component's story
 *
 * @param args args
 * @returns StoryFn<FormWrapperComponent> story
 */
const Template: StoryFn<any> = (args: any) => {
  return {
    template: `<div uiFormFieldDirective [outline]="${args.outline}">
    <label>Phone Number</label>
    <input type="text" name="account-number" id="account-number" placeholder="000-00-0000"/>
    <ui-spinner uiSuffix></ui-spinner>
    <ui-icon icon="search" uiPrefix></ui-icon>
  </div>`,
    props: {
      ...args,
    },
  };
};

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
