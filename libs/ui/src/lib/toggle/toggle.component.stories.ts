import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';
import { ToggleModule } from './toggle.module';
import { ToggleType } from './enums/toggle-type.enum';
import { Variant } from '../shared/variant.enum';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'Toggle',
  component: ToggleComponent,
  argTypes: {
    type: {
      options: ToggleType,
      control: {
        type: 'select',
      },
    },
    variant: {
      options: Variant,
      control: {
        type: 'select',
      },
    },
    icon: {
      control: 'object',
    },
    labelPosition: {
      control: 'text',
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
      <ui-toggle formControlName="toggle">
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
      <ui-toggle [icon]="icon" [labelPosition]="'left'">
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
