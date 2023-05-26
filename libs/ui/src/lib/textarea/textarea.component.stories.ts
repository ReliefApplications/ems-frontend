import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';
import { TextareaModule } from './textarea.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FocusableDirective } from '@progress/kendo-angular-grid';

export default {
  title: 'Textarea',
  component: TextareaComponent,
  argTypes: {
    value: {
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
      declarations: [FocusableDirective],
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
  return {
    component: TextareaComponent,
    template: `
      <form [formGroup]="formGroup">
      <ui-textarea [placeholder]="'${args.placeholder}'" formControlName="textarea"></ui-textarea>
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

/**
 * Kendo focusable template textarea
 *
 * @param {TextareaComponent} args args
 * @returns TextareaComponent
 */
const KendoFocusTemplate: StoryFn<TextareaComponent> = (
  args: TextareaComponent
) => {
  return {
    component: TextareaComponent,
    template: `
      <ui-textarea kendoGridFocusable [placeholder]="'${args.placeholder}'"></ui-textarea>
        `,
    props: {
      ...args,
    },
  };
};

/** Form control textarea */
export const FormTextarea = FormControlTemplate.bind({});
/** Kendo focus textarea */
export const KendoFocusTextarea = KendoFocusTemplate.bind({});
KendoFocusTextarea.args = {
  placeholder:
    'Inspect me in dev tools to check that I contain a kendo focusable directive',
};
/** Primary textarea */
export const Primary = Template.bind({});
Primary.args = {
  value: 'Hi',
  placeholder: 'Type something',
  name: 'textarea',
  minRows: 15,
};
