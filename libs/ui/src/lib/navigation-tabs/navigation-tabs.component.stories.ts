import {
  applicationConfig,
  moduleMetadata,
  Story,
  Meta,
} from '@storybook/angular';
import { NavigationTabsComponent } from './navigation-tabs.component';
import { TabModule } from '../tab/tab.module';
import { NavigationTabsModule } from './navigation-tabs.module';
import { Variant } from '../shared/variant.enum';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

export default {
  title: 'Navigation Tab',
  component: NavigationTabsComponent,
  argTypes: {
    variant: {
      options: Object.values(Variant),
      control: 'select',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        TabModule,
        NavigationTabsModule,
        CommonModule,
        BrowserAnimationsModule,
      ],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
} as Meta<NavigationTabsComponent>;

/**
 * Variant following enum
 */
const colorVariant = Variant;

/**
 * Function to test if the output emission of the navigation tab component is working
 *
 * @param event index of the currently selected tab
 */
const selectedIndexChangeEvent = (event: any) => {
  console.log(event);
};

/**
 * Template for storybook's test of navigation tab component
 *
 * @param args args of the story
 * @returns Story<NavigationTabComponent>
 */
const SelectedThirdTemplate: Story<NavigationTabsComponent> = (
  args: NavigationTabsComponent
) => {
  return {
    component: NavigationTabsComponent,
    template: `
    <ui-navigation-tabs uiNavigationTabs (selectedIndexChange)="selectedIndexChangeEvent($event)" [selectedIndex]="2" [vertical]="vertical" [variant]="variant" >  
    <ui-tab label="First" [variant]="variant">
        First content
      </ui-tab>
      <ui-tab label="Second" [variant]="variant">
        Second content
      </ui-tab>
      <ui-tab label="Third" [variant]="variant">
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
    </ui-navigation-tabs>`,
    props: {
      ...args,
      selectedIndexChangeEvent,
    },
  };
};

/**
 * Template for storybook's test of navigation tab component
 *
 * @param args args of the story
 * @returns Story<NavigationTabComponent>
 */
const SelectedFirstTemplate: Story<NavigationTabsComponent> = (
  args: NavigationTabsComponent
) => {
  return {
    component: NavigationTabsComponent,
    template: `
    <ui-navigation-tabs uiNavigationTabs (selectedIndexChange)="selectedIndexChangeEvent($event)" [selectedIndex]="0" [vertical]="vertical" [variant]="variant" >  
    <ui-tab label="First" [variant]="variant">
        First content
      </ui-tab>
      <ui-tab label="Second" [variant]="variant">
        Second content
      </ui-tab>
      <ui-tab label="Third" [variant]="variant">
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
    </ui-navigation-tabs>`,
    props: {
      ...args,
      selectedIndexChangeEvent,
    },
  };
};

/**
 * Horizontal navigation tab with first tab selected by default
 */
export const HorizontalTab = SelectedFirstTemplate.bind({});
HorizontalTab.args = {
  vertical: false,
  variant: colorVariant.DEFAULT,
};

/**
 * Vertical navigation tab with first tab selected by default
 */
export const VerticalTab = SelectedFirstTemplate.bind({});
VerticalTab.args = {
  vertical: true,
  variant: colorVariant.DEFAULT,
};

/**
 * Horizontal navigation tab with second tab selected by default
 */
export const HorizontalSelectedThirdTab = SelectedThirdTemplate.bind({});
HorizontalSelectedThirdTab.args = {
  vertical: false,
  variant: colorVariant.DEFAULT,
};

/**
 * Vertical navigation tab with third tab selected by default
 */
export const VerticalSelectedThirdTab = SelectedThirdTemplate.bind({});
VerticalSelectedThirdTab.args = {
  vertical: true,
  variant: colorVariant.DEFAULT,
};
