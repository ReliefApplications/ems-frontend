import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';
import { TextareaModule } from './textarea.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'Textarea',
  component: TextareaComponent,
  argTypes: {
    value: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    minRows: {
      type: 'number',
    },
    maxRows: {
      type: 'number',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [TextareaModule, ReactiveFormsModule],
    }),
  ],
} as Meta<TextareaComponent>;

/**
 * Template textarea
 *
 * @param {TextareaComponent} args args
 * @returns TextareaComponent
 */
const Template: StoryFn<TextareaComponent> = (args: TextareaComponent) => ({
  props: args,
});

/**
 * Form control template textarea
 *
 * @param {TextareaComponent} args args
 * @returns TextareaComponent
 */
const FormControlTemplate: StoryFn<TextareaComponent> = (
  args: TextareaComponent
) => {
  const formGroup = new FormGroup({
    textarea: new FormControl('Default value'),
  });
  args.label = 'Form control textarea';
  return {
    component: TextareaComponent,
    template: `
      <form [formGroup]="formGroup">
      <ui-textarea [placeholder]="'${args.placeholder}'" [label]="'${args.label}'" formControlName="textarea"></ui-textarea>
        </form>
        <br>
        <p>value: {{formGroup.get('textarea').value}}</p>
        <p>touched: {{formGroup.get('textarea').touched}}</p>
        `,
    props: {
      ...args,
      formGroup,
    },
  };
};

/** Form control textarea */
export const FormTextarea = FormControlTemplate.bind({});
/** Primary textarea */
export const Primary = Template.bind({});
Primary.args = {
  value: 'Hi',
  label: 'Message',
  placeholder: 'Type something',
  name: 'textarea',
  minRows: 15,
};
