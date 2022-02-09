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

const TEMPLATE: Story<SafeBreadcrumbComponent> = (args) => ({
  props: {
    ...args,
  },
});

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
