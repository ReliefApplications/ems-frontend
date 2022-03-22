import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeSchedulerModule } from './scheduler.module';
import { SafeSchedulerComponent } from './scheduler.component';

export default {
  component: SafeSchedulerComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeSchedulerModule],
      providers: [],
    }),
  ],
  title: 'WIDGETS/Scheduler',
  argTypes: {
    title: {
      defaultValue: 'Titulo de testez',
      control: { type: 'text' },
    },
    header: {
      defaultValue: true,
      control: { type: 'boolean' },
    },
  },
} as Meta;

const Template: Story = (args) => {
  const { title } = args;

  return {
    props: {
      settings: {
        title,
      },
    },
  };
};

export const DEFAULT = Template.bind({});
