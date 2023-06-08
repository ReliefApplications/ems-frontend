import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';
import { CheckboxModule } from './checkbox.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { variants } from '../types/variant';
import { IconModule } from '../icon/icon.module';

export default {
  title: 'Checkbox',
  component: CheckboxComponent,
  argTypes: {
    variant: {
      options: variants,
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
    disabled: {
      type: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CheckboxModule, ReactiveFormsModule, IconModule],
    }),
  ],
} as Meta<CheckboxComponent>;

/**
 * Template checkbox
 *
 * @param {CheckboxComponent} args args
 * @returns CheckboxComponent
 */
const Template: StoryFn<CheckboxComponent> = (args: CheckboxComponent) => {
  args.variant = 'default';
  return {
    component: CheckboxComponent,
    template: `
      <ui-checkbox [variant]="'${args.variant}'">
      <ng-container ngProjectAs="label">Checkbox text</ng-container>
      <ng-container ngProjectAs="description">Description text text text.</ng-container>
      <ng-container ngProjectAs="icon">
      <ui-icon
      icon="info_outline"
      [inline]="true"
      [size]="18"
      variant="grey"
    ></ui-icon>
      </ng-container>
      </ui-checkbox>
        `,
    props: {
      ...args,
    },
  };
};

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
  args.variant = 'default';
  return {
    component: CheckboxComponent,
    template: `
      <form [formGroup]="formGroup">
      <ui-checkbox [variant]="'${args.variant}'" formControlName="checkbox">
      <ng-container ngProjectAs="label">Form control checkbox</ng-container>
      </ui-checkbox>
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
/** Primary checkbox */
export const Primary = Template.bind({});

/** Form control checkbox */
export const FormCheckbox = FormControlTemplate.bind({});
