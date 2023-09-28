import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu.component';
import { DividerModule } from '../divider/divider.module';
import { ButtonModule } from '../button/button.module';
import { MenuModule } from './menu.module';

export default {
  title: 'Components/Menu',
  component: MenuComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        DividerModule,
        ButtonModule,
        MenuModule,
      ],
    }),
  ],
} as Meta<MenuComponent>;

/**
 * Click event handler for menu items template
 *
 * @param name of the selected button
 * @returns click event callback
 */
const clickEvent = (name: string) =>
  window.alert(`You pressed the ${name} button!`);

/**
 * Default menu items template
 */
const menuItemsTemplate = `<ui-menu #menu>
  <div uiMenuItem (click)="clickEvent('First')">Button 1</div>
  <ui-divider></ui-divider>
  <div uiMenuItem (click)="clickEvent('Second')">Button 2</div>
  <ui-divider></ui-divider>
  <div uiMenuItem (click)="clickEvent('Third')">Button 3</div>
  </ui-menu>`;

/**
 * Menu template
 *
 * @param {MenuComponent} args args
 * @returns MenuComponent
 */
const LeftTopCornerMenuTemplate: StoryFn<MenuComponent> = (
  args: MenuComponent
) => {
  return {
    component: MenuComponent,
    template: `
    <div class="flex justify-start">
    <ui-button [uiMenuTriggerFor]="menu">Open menu</ui-button>
    </div>
    ${menuItemsTemplate}`,
    props: {
      ...args,
      clickEvent,
    },
  };
};

/**
 * Menu template
 *
 * @param {MenuComponent} args args
 * @returns MenuComponent
 */
const RightTopCornerMenuTemplate: StoryFn<MenuComponent> = (
  args: MenuComponent
) => {
  return {
    component: MenuComponent,
    template: `
    <div class="flex justify-end">
    <ui-button [uiMenuTriggerFor]="menu">Open menu</ui-button>
    </div>
    ${menuItemsTemplate} `,
    props: {
      ...args,
      clickEvent,
    },
  };
};
/**
 * Menu template
 *
 * @param {MenuComponent} args args
 * @returns MenuComponent
 */
const LeftBottomCornerMenuTemplate: StoryFn<MenuComponent> = (
  args: MenuComponent
) => {
  return {
    component: MenuComponent,
    template: `
    <div style="height: calc(100vh - 50px)" class="flex items-end">
    <ui-button  [uiMenuTriggerFor]="menu">Open menu</ui-button>
    </div>
    ${menuItemsTemplate} `,
    props: {
      ...args,
      clickEvent,
    },
  };
};
/**
 * Menu template
 *
 * @param {MenuComponent} args args
 * @returns MenuComponent
 */
const RightBottomCornerMenuTemplate: StoryFn<MenuComponent> = (
  args: MenuComponent
) => {
  return {
    component: MenuComponent,
    template: `
    <div style="height: calc(100vh - 50px)" class="flex justify-end items-end">
    <ui-button  [uiMenuTriggerFor]="menu">Open menu</ui-button>
    </div> 
    ${menuItemsTemplate}`,
    props: {
      ...args,
      clickEvent,
    },
  };
};

/** Menu template in top left corner of screen */
export const LeftTopCornerMenu = LeftTopCornerMenuTemplate.bind({});

/** Menu template in bottom left corner of screen */
export const LeftBottomCornerMenu = LeftBottomCornerMenuTemplate.bind({});

/** Menu template in top right corner of screen */
export const RightTopCornerMenu = RightTopCornerMenuTemplate.bind({});

/** Menu template in bottom right corner of screen */
export const RightBottomCornerMenu = RightBottomCornerMenuTemplate.bind({});
