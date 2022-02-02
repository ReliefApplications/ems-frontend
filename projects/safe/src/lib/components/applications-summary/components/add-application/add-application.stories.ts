import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeAddApplicationComponent } from './add-application.component';
import { SafeApplicationsSummaryModule } from '../../applications-summary.module';
import { StorybookTranslateModule } from '../../../../components/storybook-translate/storybook-translate-module';

export default {
  component: SafeAddApplicationComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeApplicationsSummaryModule, StorybookTranslateModule],
      providers: [],
    }),
  ],
  title: 'UI/Applications/Add Application',
  argTypes: {},
} as Meta;

const TEMPLATE: Story<SafeAddApplicationComponent> = (args) => ({
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {};
