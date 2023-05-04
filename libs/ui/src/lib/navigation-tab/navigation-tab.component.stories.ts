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

/**
 * Function to test if the output emission of the navigation tab component is working
 *
 * @param event index of the currently selected tab
 */
const selectedIndexChangeEvent = (event: any) => {
  console.log(event);
};

/**
 * Template to display by the story
 */
const navigationTabTemplate = `<ui-navigation-tab uiNavigationTab (selectedIndexChange)="selectedIndexChangeEvent($event)" [selectedIndex]="selectedIndex" [vertical]="vertical">
  <ui-tab label="First">
    First content
  </ui-tab>
  <ui-tab label="Second">
    Second content
  </ui-tab>
  <ui-tab label="Third">
    <div class="text-red-600">
      Third content 
    </div>
    <button class="bg-primary-400 hover:bg-primary-600 focus:ring-0 focus:ring-primary-200 rounded-md p-2 text-small text-gray-800"> Random Content </button>
    <div class="justify-center"> a </div>
    <div> a </div>
    <div> a </div>
    <div> a </div>
    <div> a </div>
    <div> a </div>
    <div> a </div>
  </ui-tab>
</ui-navigation-tab>`;

/**
 * Template for storybook's test of navigation tab component
 *
 * @param args args of the story
 * @returns Story<NavigationTabComponent>
 */
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

/**
 * Horizontal navigation tab with first tab selected by default
 */
export const HorizontalTab = Template.bind({});
HorizontalTab.args = {
  selectedIndex: 0,
  vertical: false,
};

/**
 * Vertical navigation tab with first tab selected by default
 */
export const VerticalTab = Template.bind({});
VerticalTab.args = {
  selectedIndex: 0,
  vertical: true,
};

/**
 * Horizontal navigation tab with second tab selected by default
 */
export const DefaultSelection1Tab = Template.bind({});
DefaultSelection1Tab.args = {
  selectedIndex: 1,
  vertical: false,
};

/**
 * Vertical navigation tab with third tab selected by default
 */
export const VerticalDefaultSelection1Tab = Template.bind({});
VerticalDefaultSelection1Tab.args = {
  selectedIndex: 2,
  vertical: true,
};
