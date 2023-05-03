import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NavigationTabComponent } from './navigation-tab.component';
import { TabModule } from '../tab/tab.module';
import { NavigationTabModule } from './navigation-tab.module';

export default {
  title: 'Navigation Tab',
  component: NavigationTabComponent,
  decorators: [
    moduleMetadata({
      imports: [TabModule, NavigationTabModule],
    }),
  ],
} as Meta<NavigationTabComponent>;

const navigationTabTemplate = `<ui-navigation-tab uiNavigationTab [selectedIndex]="0" [vertical]="false">
<ui-tab label="First">First content</ui-tab>
<ui-tab label="Second">Second content</ui-tab>
<ui-tab label="Third">Third content</ui-tab>
</ui-navigation-tab>`;

const Template: Story<NavigationTabComponent> = (
  args: NavigationTabComponent
) => {
  return {
    component: NavigationTabComponent,
    template: navigationTabTemplate,
    props: {
      ...args,
    },
  };
};

export const NavigationTab = Template.bind({});
NavigationTab.args = {};
