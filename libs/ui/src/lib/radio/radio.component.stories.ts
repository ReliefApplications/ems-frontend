import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { RadioComponent } from './radio.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RadioGroupDirective } from './radio-group.directive';

type RadioOption = {
  label: string;
  value: string;
};

export default {
  title: 'RadioComponent',
  component: RadioComponent,
  argTypes: {
    value: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      declarations: [RadioGroupDirective],
      imports: [ReactiveFormsModule],
    }),
  ],
} as Meta<RadioComponent>;

const radioOptions: RadioOption[] = [
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Phone (SMS)',
    value: 'sms',
  },
  {
    label: 'Push Notification',
    value: 'push',
  },
];

/**
 * Template radiogroup
 *
 * @param {RadioComponent} args args
 * @returns RadioComponent
 */
const Template: StoryFn<RadioComponent> = (args: RadioComponent) => {
  args.name = 'notification-method';
  let templateContent = `
    <div class="space-y-4" [aria-labelledby]= "'${args.ariaLabelledby}'">
  `;
  for (const op of radioOptions) {
    templateContent += `
      <div class="flex items-center" uiRadioGroupDirective [nameGroup]="'${args.name}'">
        <ui-radio 
          [value]= "'${op.value}'"
          >
        </ui-radio>
        <ng-container ngProjectAs="label">${op.label}</ng-container>
      </div>
    `;
  }
  templateContent += `
    </div>
  `;
  console.log(templateContent);
  return {
    component: RadioComponent,
    template: templateContent,
    props: {
      ...args,
    },
  };
};

/**
 * Form control template radio
 *
 * @param {RadioComponent} args args
 * @returns RadioComponent
 */
const FormControlTemplate: StoryFn<RadioComponent> = (args: RadioComponent) => {
  const formGroup = new FormGroup({
    radio: new FormControl('Default value'),
  });
  let templateContent = `
    <form [formGroup]="formGroup">
      <div class="space-y-4" [aria-labelledby]= "'${args.ariaLabelledby}'">
  `;
  for (const op of radioOptions) {
    templateContent += `
        <div class="flex items-center" uiRadioGroupDirective [nameGroup]="'${args.name}'">
          <ui-radio 
            [value]= "'${op.value}'"
            >
          </ui-radio>
          <ng-container ngProjectAs="label">${op.label}</ng-container>
       </div>
    `;
  }
  templateContent += `
      </div>
    </form>
    <br>
    <p>value: {{formGroup.get('radio').value}}</p>
    <p>touched: {{formGroup.get('radio').touched}}</p>
  `;
  return {
    component: RadioComponent,
    template: templateContent,
    props: {
      ...args,
      formGroup,
    },
  };
};
/** Primary radio */
export const Primary = Template.bind({});

/** Form control radio */
export const FormRadio = FormControlTemplate.bind({});
