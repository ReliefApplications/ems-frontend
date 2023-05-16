import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TabsModule } from './tabs.module';
import { TabsComponent } from './tabs.component';

export default {
  title: 'Tabs',
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
        <ui-tab label="First">Content 1</ui-tab>
        <ui-tab label="Second">Content 2</ui-tab>
        <ui-tab label="Disabled" [disabled]="true">Content 3</ui-tab>
      </ui-tabs>`,
    };
  },
} as Meta<TabsComponent>;

export const Default: StoryObj<TabsComponent> = {
  args: {
    vertical: false,
  },
};

export const Vertical: StoryObj<TabsComponent> = {
  args: {
    vertical: true,
  },
};
