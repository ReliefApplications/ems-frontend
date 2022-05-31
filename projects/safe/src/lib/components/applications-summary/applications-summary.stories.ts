import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeApplicationsSummaryComponent } from './applications-summary.component';
import { SafeApplicationsSummaryModule } from './applications-summary.module';
import { status } from '../../models/form.model';

export default {
  component: SafeApplicationsSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeApplicationsSummaryModule],
      providers: [],
    }),
  ],
  title: 'UI/Applications/Applications Summary',
  argTypes: {},
} as Meta;

/**
 * Defines a template for the component SafeApplicationsSummaryComponent to use as a playground
 *
 * @param args the properties of the instance of SafeApplicationsSummaryComponent
 * @returns the template
 */
const TEMPLATE: Story<SafeApplicationsSummaryComponent> = (args) => ({
  props: {
    ...args,
  },
});

/** Exports a default template with mock properties */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {
  canCreate: true,
  applications: [
    {
      name: 'Dummy Application',
      createdAt: new Date(),
      usersCount: 250,
      status: status.active,
    },
    {
      name: 'Dummy Application',
      createdAt: new Date(),
      usersCount: 250,
      status: status.pending,
    },
    {
      name: 'Dummy Application',
      createdAt: new Date(),
      usersCount: 250,
      status: status.archived,
    },
    {
      name: 'Dummy Application',
      createdAt: new Date(),
      usersCount: 250,
      status: status.active,
    },
    {
      name: 'Dummy Application',
      createdAt: new Date(),
      usersCount: 250,
    },
  ],
};
