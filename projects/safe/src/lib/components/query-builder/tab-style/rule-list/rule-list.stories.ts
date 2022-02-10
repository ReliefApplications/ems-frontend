import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeRuleListComponent } from './rule-list.component';
import { SafeButtonModule } from '../../../ui/button/button.module';

export default {
  component: SafeRuleListComponent,
  decorators: [
    moduleMetadata({
      declarations: [SafeRuleListComponent],
      imports: [SafeButtonModule],
    }),
  ],
  title: 'UI/Rule-List',
} as Meta;

const TEMPLATE_DEFAULT: Story<SafeRuleListComponent> = (args) => ({
  template: `<safe-rule-list [stylesList]="stylesList"></safe-rule-list>`,
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE_DEFAULT.bind({});

DEFAULT.args = {
  stylesList: [
    {
      backgroundColor: '',
      fields: [],
      filter: {
        logic: 'and',
        filters: [],
      },
      styleAppliedTo: 'whole-row',
      textColor: '',
      textStyle: '',
      title: 'New rule',
    },
  ],
};

export const CUSTOM = TEMPLATE_DEFAULT.bind({});

CUSTOM.args = {
  stylesList: [
    {
      backgroundColor: 'rgba(19, 210, 35, 1)',
      fields: [],
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'comment',
            operator: 'contains',
            value: 'commentaire',
          },
        ],
      },
      styleAppliedTo: 'whole-row',
      textColor: 'rgba(0, 0, 0, 1)',
      textStyle: 'underline',
      title: 'Underline',
    },
    {
      backgroundColor: 'rgba(255, 0, 0, 1)',
      fields: [],
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'comment',
            operator: 'contains',
            value: 'commentaire',
          },
        ],
      },
      styleAppliedTo: 'whole-row',
      textColor: 'rgba(0, 0, 0, 1)',
      textStyle: 'bold',
      title: 'Bold',
    },
    {
      backgroundColor: 'rgba(64, 55, 161, 1)',
      fields: [],
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'comment',
            operator: 'contains',
            value: 'commentaire',
          },
        ],
      },
      styleAppliedTo: 'whole-row',
      textColor: 'rgba(0, 0, 0, 1)',
      textStyle: 'italic',
      title: 'Italic',
    },
  ],
};
