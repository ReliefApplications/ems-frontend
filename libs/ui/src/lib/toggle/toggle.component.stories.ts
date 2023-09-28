import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';
import { ToggleModule } from './toggle.module';
import { toggleTypes } from './types/toggle-type';
import { variants } from '../types/variant';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'Components/Toggle',
  component: ToggleComponent,
  argTypes: {
    type: {
      options: toggleTypes,
      control: {
        type: 'select',
      },
    },
    variant: {
      options: variants,
      control: {
        type: 'select',
      },
    },
    icon: {
      control: 'object',
    },
    labelPosition: {
      options: ['right', 'left'],
      control: {
        type: 'select',
      },
    },
    disabled: {
      type: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ToggleModule, ReactiveFormsModule],
    }),
  ],
} as Meta<ToggleComponent>;

/**
 * Form control template toggle
 *
 * @param {ToggleComponent} args args
 * @returns ToggleComponent
 */
const FormControlTemplate: StoryFn<ToggleComponent> = (
  args: ToggleComponent
) => {
  const formGroup = new FormGroup({
    toggle: new FormControl(true),
  });
  return {
    component: ToggleComponent,
    template: `
      <form [formGroup]="formGroup">
      <ui-toggle [type]="'${args.type}'" [variant]="'${args.variant}'" [labelPosition]="'${args.labelPosition}'" formControlName="toggle">
        <ng-container ngProjectAs="label">Test test test!</ng-container>
        <ng-container ngProjectAs="description">
          Test test test test test test test test test test test test test
        </ng-container>
      </ui-toggle>
        </form>
        <br>
        <p>value: {{formGroup.get('toggle').value}}</p>
        <p>touched: {{formGroup.get('toggle').touched}}</p>
        `,
    props: {
      ...args,
      formGroup,
    },
  };
};
/** Form control toggle */
export const FormToggle = FormControlTemplate.bind({});
FormToggle.args = {
  labelPosition: 'right',
  variant: 'primary',
  type: 'simple',
};

/**
 * Primary template toggle
 *
 * @param {ToggleComponent} args args
 * @returns ToggleComponent
 */
const PrimaryTemplate: StoryFn<ToggleComponent> = (args: ToggleComponent) => {
  args.icon = {
    disableIcon: 'close',
    enableIcon: 'save',
  };
  return {
    component: ToggleComponent,
    template: `
      <ui-toggle [type]="'${args.type}'" [icon]="icon" [variant]="'${args.variant}'" [labelPosition]="'${args.labelPosition}'">
        <ng-container ngProjectAs="label">Test test test!</ng-container>
        <ng-container ngProjectAs="description">
          Test test test test test test test test test test test test test
        </ng-container>
      </ui-toggle>
        `,
    props: {
      ...args,
    },
  };
};
/** Primary toggle */
export const Primary = PrimaryTemplate.bind({});
Primary.args = {
  labelPosition: 'right',
  variant: 'primary',
  type: 'simple',
};
