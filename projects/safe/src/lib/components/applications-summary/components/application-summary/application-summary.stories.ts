import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeApplicationSummaryComponent } from './application-summary.component';
import { SafeApplicationsSummaryModule } from '../../applications-summary.module';
import { status } from '../../../../models/form.model';
import { StorybookTranslateModule } from '../../../../components/storybook-translate/storybook-translate-module';

export default {
  component: SafeApplicationSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeApplicationsSummaryModule, StorybookTranslateModule],
      providers: [],
    }),
  ],
  title: 'UI/Applications/Application Summary',
  argTypes: {},
} as Meta;

const TEMPLATE: Story<SafeApplicationSummaryComponent> = (args) => ({
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {
  application: {
    name: 'Dummy Application',
    createdAt: new Date(),
    usersCount: 250,
    status: status.active,
  },
};
