import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';
import { CheckboxModule } from './checkbox.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Variant } from '../shared/variant.enum';

export default {
  title: 'Checkbox',
  component: CheckboxComponent,
  argTypes: {
    variant: {
      options: Object.values(Variant),
      control: {
        type: 'select',
      },
    },
    checked: {
      defaultValue: true,
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
    ariaLabel: {
      defaultValue: 'comments-aria-label',
      control: { type: 'text' },
    },
    name: {
      defaultValue: 'comments',
      control: { type: 'text' },
    },
    label: {
      defaultValue: 'A label',
      control: { type: 'text' },
    },
    description: {
      defaultValue: 'This is an description.',
      control: { type: 'text' },
    },
    disabled: {
      type: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CheckboxModule, ReactiveFormsModule],
    }),
  ],
} as Meta<CheckboxComponent>;

/**
 * Template checkbox
 *
 * @param {CheckboxComponent} args args
 * @returns CheckboxComponent
 */
const Template: StoryFn<CheckboxComponent> = (args: CheckboxComponent) => ({
  props: args,
});

/**
 * Form control template checkbox
 *
 * @param {CheckboxComponent} args args
 * @returns CheckboxComponent
 */
const FormControlTemplate: StoryFn<CheckboxComponent> = (
  args: CheckboxComponent
) => {
  const formGroup = new FormGroup({
    checkbox: new FormControl(false),
  });
  args.label = 'Form control checkbox';
  return {
    component: CheckboxComponent,
    template: `
      <form [formGroup]="formGroup">
      <ui-checkbox [label]="'${args.label}'" [variant]="'${args.variant}'" formControlName="checkbox"></ui-checkbox>
        </form>
        <br>
        <p>value: {{formGroup.get('checkbox').value}}</p>
        <p>touched: {{formGroup.get('checkbox').touched}}</p>
        `,
    props: {
      ...args,
      formGroup,
    },
  };
};
/** Form control checkbox */
export const FormCheckbox = FormControlTemplate.bind({});

/** Primary checkbox */
export const Primary = Template.bind({});
Primary.args = {
  checked: true,
  indeterminate: false,
  name: '',
  label: 'Checkbox text',
  ariaLabel: '',
  description: 'Description text text text.',
  variant: Variant.PRIMARY,
};
