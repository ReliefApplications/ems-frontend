import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeRuleComponent } from './rule.component';
import { RuleAppliedStyle } from './rule-applied-style.enum';
import { RuleTextStyle } from './rule-text-style.enum';
import { FormBuilder } from '@angular/forms';

export default {
  component: SafeRuleComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [],
    }),
  ],
  title: 'UI/Rule',
  argTypes: {
    appliedStyle: {
      options: [RuleAppliedStyle.WHOLE_ROW, RuleAppliedStyle.SELECTED_COLUMNS],
      control: { type: 'select' },
    },
    textStyle: {
      options: [
        RuleTextStyle.BOLD,
        RuleTextStyle.DEFAULT,
        RuleTextStyle.ITALIC,
        RuleTextStyle.UNDERLINE,
      ],
      control: { type: 'select' },
    },
    block: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
    content: {
      defaultValue: 'This is a button',
      control: { type: 'text' },
    },
  },
} as Meta;

const fb = new FormBuilder();
const formObj = fb.group({
  title: [`New rule`],
  backgroundColor: '',
  textColor: '',
  textStyle: 'default',
  styleAppliedTo: 'whole-row',
  fields: fb.array([]),
  filters: fb.group({
    field: '',
    operator: 'and',
    value: null,
  }),
});
// const TEMPLATE_DEFAULT: Story<SafeRuleComponent> = (args) => ({
//   template: '<safe-rule [stylesList]=stylesList [styleForm]=fieldForm [scalarFields]=scalarFields [settings]=settings
//   [availableFields]=availableFields [factory]=factory></safe-rule>',
//   props: {
//     ...args,
//   },
// });

// export const DEFAULT = TEMPLATE_DEFAULT.bind({});
// DEFAULT.args = {
//   styleForm
//   // rajouter tous les input la dedans
// };
