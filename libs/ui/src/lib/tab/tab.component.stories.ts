import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TabComponent } from './tab.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'Tab',
  component: TabComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<TabComponent>;

const tabTemplate = '<ui-tab [label]="label"><div> Test </div></ui-tab>';

const Template: Story<TabComponent> = (args: TabComponent) => {
  args.label = 'Label';
  return {
    component: TabComponent,
    template: tabTemplate,
    props: {
      ...args,
    },
  };
};

export const Tab = Template.bind({});
