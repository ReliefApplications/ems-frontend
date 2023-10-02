import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TabsModule } from './tabs.module';
import { TabsComponent } from './tabs.component';

export default {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  component: TabsComponent,
  decorators: [
    moduleMetadata({
      imports: [TabsModule, BrowserAnimationsModule],
    }),
  ],
  render: (args) => {
    return {
      props: args,
      template: `<ui-tabs [vertical]=${args.vertical}>
        <ui-tab>
          <ng-container ngProjectAs="label">First</ng-container>
          Content 1
        </ui-tab>
        <ui-tab>
          <ng-container ngProjectAs="label">Second</ng-container>
          Content 2
        </ui-tab>
        <ui-tab [disabled]="true">
          <ng-container ngProjectAs="label">Disabled</ng-container>
          Content 3
        </ui-tab>
      </ui-tabs>`,
    };
  },
} as Meta<TabsComponent>;

/**
 * Default story
 */
export const Default: StoryObj<TabsComponent> = {
  args: {
    vertical: false,
  },
};

/**
 * Vertical story
 */
export const Vertical: StoryObj<TabsComponent> = {
  args: {
    vertical: true,
  },
};
