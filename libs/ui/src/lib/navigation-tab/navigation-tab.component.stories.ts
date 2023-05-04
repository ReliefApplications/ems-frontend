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

const selectedIndexChangeEvent = (event: any) => {
  console.log(event);
};

const navigationTabTemplate = `<ui-navigation-tab uiNavigationTab (selectedIndexChange)="selectedIndexChangeEvent($event)" [selectedIndex]="selectedIndex" [vertical]="vertical">
  <ui-tab label="First">First content</ui-tab>
  <ui-tab label="Second">Second content</ui-tab>
  <ui-tab label="Third">
    <div class="text-red-600"> Third content </div>
    <button class="bg-primary-400 hover:bg-primary-600 focus:ring-0 focus:ring-primary-200 rounded-md p-2 text-small text-gray-800"> Random Content </button>
    <div> a </div>
    <div> a </div>
    <div> a </div>
    <div> a </div>
    <div> a </div>
    <div> a </div>
    <div> a </div>
  </ui-tab>
</ui-navigation-tab>`;

const Template: Story<NavigationTabComponent> = (
  args: NavigationTabComponent
) => {
  return {
    component: NavigationTabComponent,
    template: navigationTabTemplate,
    props: {
      ...args,
      selectedIndexChangeEvent,
    },
  };
};

export const HorizontalTab = Template.bind({});
HorizontalTab.args = {
  selectedIndex: 0,
  vertical: false,
};

export const VerticalTab = Template.bind({});
VerticalTab.args = {
  selectedIndex: 0,
  vertical: true,
};

export const DefaultSelection1Tab = Template.bind({});
DefaultSelection1Tab.args = {
  selectedIndex: 1,
  vertical: false,
};
