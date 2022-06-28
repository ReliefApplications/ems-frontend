import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeBreadcrumbComponent } from './breadcrumb.component';
import { SafeBreadcrumbModule } from './breadcrumb.module';

export default {
  component: SafeBreadcrumbComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeBreadcrumbModule],
    }),
  ],
  title: 'UI/Breadcrumb',
} as Meta;

/**
 * Template used by storybook to display the component in stories.
 *
 * @param args story arguments
 * @returns story template
 */
const TEMPLATE: Story<SafeBreadcrumbComponent> = (args) => ({
  props: {
    ...args,
  },
});

/**
 * Default story.
 */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  items: [
    {
      name: 'item 0',
      href: '#',
    },
    {
      name: 'item 1',
      href: '#',
    },
    {
      name: 'item 2',
      href: '#',
    },
  ],
};
