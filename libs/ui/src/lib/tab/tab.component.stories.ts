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

/**
 * Tab default template
 */
const tabTemplate = '<ui-tab [label]="label"><div> Test </div></ui-tab>';

/**
 * Template for storybook's test of tab component
 *
 * @param args args of the story
 * @returns Story<TabComponent>
 */
const Template: Story<TabComponent> = (args: TabComponent) => {
  return {
    component: TabComponent,
    template: tabTemplate,
    props: {
      ...args,
    },
  };
};

/**
 * Test template
 */
export const Tab = Template.bind({});
Tab.args = {
  label: 'Label',
};
