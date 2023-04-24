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
    label: {
      control: 'object',
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
 * Template toggle
 *
 * @param {ToggleComponent} args args
 * @returns ToggleComponent
 */
const Template: StoryFn<ToggleComponent> = (args: ToggleComponent) => {
  const formGroup = new FormGroup({
    toggle: new FormControl(true),
  });
  return {
    component: ToggleComponent,
    template: `
      <form [formGroup]="formGroup">
      <ui-toggle formControlName="toggle"></ui-toggle>
        </form>
        <p>value: {{formGroup.get('toggle').value}}</p>
        <br>
        <p>touched: {{formGroup.get('toggle').touched}}</p>
        `,
    props: {
      ...args,
      formGroup,
    },
  };
};

/** Primary toggle */
export const Primary = Template.bind({});
Primary.args = {
  type: ToggleType.SIMPLE,
  variant: Variant.PRIMARY,
  icon: {
    disableIcon: 'close',
    enableIcon: 'save',
  },
  label: {
    text: 'Test test test!',
    position: 'left',
    description:
      'Test test test test test test test test test test test test test',
  },
};
