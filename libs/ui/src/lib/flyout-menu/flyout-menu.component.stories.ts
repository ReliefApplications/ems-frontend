import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { FlyoutMenuComponent } from './flyout-menu.component';
import { StorybookTranslateModule } from '../../storybook-translate.module';
import { FlyoutMenuModule } from './flyout-menu.module';

export default {
  title: 'FlyoutMenuComponent',
  component: FlyoutMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FlyoutMenuModule,
        StorybookTranslateModule],
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
