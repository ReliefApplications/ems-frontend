import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { FlyoutMenuComponent } from './flyout-menu.component';
import { TranslateModule } from '@ngx-translate/core';

export default {
  title: 'FlyoutMenuComponent',
  component: FlyoutMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslateModule],
    }),
  ],
} as Meta<FlyoutMenuComponent>;

const Template: StoryFn<FlyoutMenuComponent> = (args: FlyoutMenuComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  menuLabel: '',
  menuItems: [],
};
