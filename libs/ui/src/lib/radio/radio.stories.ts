import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { RadioComponent } from './radio.component';
import { RadioGroupDirective } from './radio-group.directive';
import { variants } from '../types/variant';

type RadioOption = {
  label: string;
  value: string;
};

export default {
  title: 'Components/Radio',
  tags: ['autodocs'],
  component: RadioComponent,
  argTypes: {
    variant: {
      options: variants,
      control: {
        type: 'select',
      },
    },
    required: {
      control: 'boolean',
    },
    disabled: {
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

/**
 *
 */
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
 * Form control for story testing
 */
const formControl = new FormControl();
let selectedOption!: any;

/**
 * Function to test radio change callback when no form control is used
 *
 * @param radioSelectionChange Radio value
 */
const getRadioChangeSelection = (radioSelectionChange: any) => {
  selectedOption = radioSelectionChange;
  addons.getChannel().emit(FORCE_RE_RENDER);
};

/**
 * Template radio group
 *
 * @param {RadioComponent} args args
 * @returns RadioComponent
 */
const Template: StoryFn<RadioComponent> = (args: RadioComponent) => {
  args.name = 'notification-method';
  return {
    component: RadioComponent,
    template: `
    <div class="space-y-4" (groupValueChange)="getRadioChangeSelection($event)" [uiRadioGroupDirective]="'${args.name}'">
    <ui-radio *ngFor="let option of radioOptions; " [disabled]="${args.disabled}" [variant]="'${args.variant}'" [value]="option.value">
      <ng-container ngProjectAs="label">{{option.label}}</ng-container>
    </ui-radio>
    </div>
    <br>
    <p>value: {{selectedOption}}</p>
    `,
    props: {
      ...args,
      radioOptions,
      getRadioChangeSelection,
      selectedOption,
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
  args.name = 'notification-method';
  return {
    component: RadioComponent,
    template: `
    <div class="space-y-4" [formControl]="formControl" [uiRadioGroupDirective]="'${args.name}'">
    <ui-radio *ngFor="let option of radioOptions" [disabled]="${args.disabled}" [variant]="'${args.variant}'" [value]="option.value" >
      <ng-container ngProjectAs="label">{{option.label}}</ng-container>
    </ui-radio>
    </div>
    <br>
    <p>value: {{formControl.value}}</p>
    <p>touched: {{formControl.touched}}</p>
`,
    props: {
      ...args,
      formControl,
      radioOptions,
    },
  };
};
/** Primary radio */
export const Primary = Template.bind({});

/** Form control radio */
export const FormRadio = FormControlTemplate.bind({});
