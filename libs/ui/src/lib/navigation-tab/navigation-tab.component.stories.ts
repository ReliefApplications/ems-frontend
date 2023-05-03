import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NavigationTabComponent } from './navigation-tab.component';

export default {
  title: 'NavigationTabComponent',
  component: NavigationTabComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<NavigationTabComponent>;

const Template: Story<NavigationTabComponent> = (args: NavigationTabComponent) => ({
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}